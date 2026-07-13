"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalEntriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let JournalEntriesService = class JournalEntriesService {
    constructor(prisma, serialSvc, auditSvc) {
        this.prisma = prisma;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, grantId, periodId } = query;
        const where = {
            ...(status && { status }),
            ...(grantId && { grantId }),
            ...(periodId && { periodId }),
            ...(search && {
                OR: [
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.journalEntry.findMany({
                where,
                include: {
                    grant: { select: { id: true, code: true } },
                    period: { select: { id: true, name: true } },
                    _count: { select: { lines: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { entryDate: 'desc' },
            }),
            this.prisma.journalEntry.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const entry = await this.prisma.journalEntry.findUnique({
            where: { id },
            include: {
                lines: { include: { account: { select: { id: true, code: true, name: true } } } },
                grant: { select: { id: true, code: true, name: true } },
                period: true,
                postedBy: { select: { firstName: true, lastName: true } },
            },
        });
        if (!entry)
            throw new common_1.NotFoundException(`Journal Entry ${id} not found`);
        return entry;
    }
    async create(dto, user) {
        const totalDebit = dto.lines?.reduce((sum, l) => sum + Number(l.debitAmount || 0), 0) || 0;
        const totalCredit = dto.lines?.reduce((sum, l) => sum + Number(l.creditAmount || 0), 0) || 0;
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new common_1.BadRequestException(`Journal entry is not balanced. Debit: ${totalDebit.toFixed(2)}, Credit: ${totalCredit.toFixed(2)}`);
        }
        const serialNumber = await this.serialSvc.next(dto.grantCode || 'SYS', 'JE');
        const entry = await this.prisma.journalEntry.create({
            data: {
                serialNumber,
                entryDate: new Date(dto.entryDate),
                description: dto.description,
                reference: dto.reference,
                sourceType: dto.sourceType || 'MANUAL',
                sourceId: dto.sourceId,
                grantId: dto.grantId,
                periodId: dto.periodId,
                currency: dto.currency || 'USD',
                totalDebit: new client_1.Prisma.Decimal(totalDebit),
                totalCredit: new client_1.Prisma.Decimal(totalCredit),
                status: client_1.JournalStatus.DRAFT,
                createdById: user.id,
                lines: {
                    create: dto.lines.map((line, idx) => ({
                        accountId: line.accountId,
                        description: line.description,
                        debitAmount: new client_1.Prisma.Decimal(line.debitAmount || '0'),
                        creditAmount: new client_1.Prisma.Decimal(line.creditAmount || '0'),
                        currency: line.currency || dto.currency || 'USD',
                        exchangeRate: new client_1.Prisma.Decimal(line.exchangeRate || '1'),
                        baseDebit: new client_1.Prisma.Decimal(Number(line.debitAmount || 0) * Number(line.exchangeRate || 1)),
                        baseCredit: new client_1.Prisma.Decimal(Number(line.creditAmount || 0) * Number(line.exchangeRate || 1)),
                        grantId: line.grantId || dto.grantId,
                        budgetLineId: line.budgetLineId,
                        lineNumber: idx + 1,
                    })),
                },
            },
            include: { lines: true },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'JOURNAL_ENTRIES',
            resource: 'JournalEntry',
            resourceId: entry.id,
            newValues: { serialNumber, description: entry.description, totalDebit, totalCredit },
        });
        return entry;
    }
    async post(id, user) {
        const entry = await this.findOne(id);
        if (entry.status !== client_1.JournalStatus.DRAFT) {
            throw new common_1.BadRequestException('Only DRAFT journal entries can be posted');
        }
        const period = await this.prisma.accountingPeriod.findUnique({ where: { id: entry.periodId } });
        if (period?.status !== 'OPEN') {
            throw new common_1.BadRequestException('Accounting period is closed');
        }
        const updated = await this.prisma.journalEntry.update({
            where: { id },
            data: {
                status: client_1.JournalStatus.POSTED,
                isPosted: true,
                postedAt: new Date(),
                postedById: user.id,
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'APPROVE',
            module: 'JOURNAL_ENTRIES',
            resource: 'JournalEntry',
            resourceId: id,
            newValues: { status: 'POSTED' },
        });
        return updated;
    }
    async reverse(id, user) {
        const entry = await this.findOne(id);
        if (entry.status !== client_1.JournalStatus.POSTED) {
            throw new common_1.BadRequestException('Only POSTED entries can be reversed');
        }
        if (entry.isReversed) {
            throw new common_1.BadRequestException('Entry is already reversed');
        }
        const reversalSerial = await this.serialSvc.next(entry.grantId ? 'SYS' : 'SYS', 'JE');
        const reversal = await this.prisma.journalEntry.create({
            data: {
                serialNumber: reversalSerial,
                entryDate: new Date(),
                description: `REVERSAL of ${entry.serialNumber}: ${entry.description}`,
                reference: `REV-${entry.serialNumber}`,
                sourceType: 'MANUAL',
                grantId: entry.grantId,
                periodId: entry.periodId,
                currency: entry.currency,
                totalDebit: entry.totalCredit,
                totalCredit: entry.totalDebit,
                status: client_1.JournalStatus.POSTED,
                isPosted: true,
                postedAt: new Date(),
                postedById: user.id,
                reversedById: entry.id,
                createdById: user.id,
                lines: {
                    create: entry.lines.map((line, idx) => ({
                        accountId: line.accountId,
                        description: `REV: ${line.description || ''}`,
                        debitAmount: line.creditAmount,
                        creditAmount: line.debitAmount,
                        currency: line.currency,
                        exchangeRate: line.exchangeRate,
                        baseDebit: line.baseCredit,
                        baseCredit: line.baseDebit,
                        grantId: line.grantId,
                        budgetLineId: line.budgetLineId,
                        lineNumber: idx + 1,
                    })),
                },
            },
        });
        await this.prisma.journalEntry.update({
            where: { id },
            data: { isReversed: true, status: client_1.JournalStatus.REVERSED },
        });
        return reversal;
    }
    async getTrialBalance(periodId, grantId) {
        const lines = await this.prisma.journalLine.findMany({
            where: {
                journalEntry: {
                    isPosted: true,
                    ...(periodId && { periodId }),
                    ...(grantId && { grantId }),
                },
            },
            include: {
                account: { select: { id: true, code: true, name: true, accountType: true, normalBalance: true } },
            },
        });
        const accountMap = new Map();
        for (const line of lines) {
            const key = line.accountId;
            if (!accountMap.has(key)) {
                accountMap.set(key, { account: line.account, totalDebit: 0, totalCredit: 0 });
            }
            const entry = accountMap.get(key);
            entry.totalDebit += Number(line.debitAmount);
            entry.totalCredit += Number(line.creditAmount);
        }
        const trialBalance = Array.from(accountMap.values())
            .map((entry) => ({
            ...entry.account,
            totalDebit: entry.totalDebit,
            totalCredit: entry.totalCredit,
            balance: entry.account.normalBalance === 'DEBIT'
                ? entry.totalDebit - entry.totalCredit
                : entry.totalCredit - entry.totalDebit,
        }))
            .sort((a, b) => a.code.localeCompare(b.code));
        const totals = {
            totalDebit: trialBalance.reduce((s, a) => s + a.totalDebit, 0),
            totalCredit: trialBalance.reduce((s, a) => s + a.totalCredit, 0),
            isBalanced: Math.abs(trialBalance.reduce((s, a) => s + a.totalDebit, 0) -
                trialBalance.reduce((s, a) => s + a.totalCredit, 0)) < 0.01,
        };
        return { data: { accounts: trialBalance, totals } };
    }
};
exports.JournalEntriesService = JournalEntriesService;
exports.JournalEntriesService = JournalEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        serial_service_1.SerialService,
        audit_service_1.AuditService])
], JournalEntriesService);
//# sourceMappingURL=journal-entries.service.js.map