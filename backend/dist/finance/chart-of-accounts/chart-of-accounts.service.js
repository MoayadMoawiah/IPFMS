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
exports.ChartOfAccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let ChartOfAccountsService = class ChartOfAccountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)({ ...query, limit: query?.limit ?? 100 });
        const { search, accountType, isLeaf } = query;
        const where = {
            deletedAt: null,
            ...(accountType && { accountType }),
            ...(isLeaf !== undefined && { isLeaf: isLeaf === 'true' }),
            ...(search && {
                OR: [
                    { code: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.chartOfAccount.findMany({
                where,
                include: { parent: { select: { id: true, code: true, name: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { code: 'asc' },
            }),
            this.prisma.chartOfAccount.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async getTree() {
        const accounts = await this.prisma.chartOfAccount.findMany({
            where: { deletedAt: null },
            orderBy: { code: 'asc' },
        });
        const map = new Map(accounts.map((a) => [a.id, { ...a, children: [] }]));
        const roots = [];
        for (const account of accounts) {
            if (account.parentId && map.has(account.parentId)) {
                map.get(account.parentId).children.push(map.get(account.id));
            }
            else if (!account.parentId) {
                roots.push(map.get(account.id));
            }
        }
        return { data: roots };
    }
    async findOne(id) {
        const account = await this.prisma.chartOfAccount.findUnique({
            where: { id, deletedAt: null },
            include: {
                parent: { select: { id: true, code: true, name: true } },
                children: { select: { id: true, code: true, name: true, isLeaf: true } },
            },
        });
        if (!account)
            throw new common_1.NotFoundException(`Account ${id} not found`);
        return account;
    }
    async getLedger(id, query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)({ ...query, limit: query?.limit ?? 50 });
        const { startDate, endDate } = query;
        const where = {
            accountId: id,
            ...(startDate || endDate ? {
                journalEntry: {
                    entryDate: {
                        ...(startDate && { gte: new Date(startDate) }),
                        ...(endDate && { lte: new Date(endDate) }),
                    },
                    isPosted: true,
                },
            } : {}),
        };
        const [lines, total] = await Promise.all([
            this.prisma.journalLine.findMany({
                where,
                include: {
                    journalEntry: { select: { serialNumber: true, entryDate: true, description: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.journalLine.count({ where }),
        ]);
        return { data: lines, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async create(dto) {
        return this.prisma.chartOfAccount.create({
            data: {
                code: dto.code,
                name: dto.name,
                arabicName: dto.arabicName,
                accountType: dto.accountType,
                parentId: dto.parentId,
                level: dto.level || 1,
                isLeaf: dto.isLeaf !== false,
                isActive: true,
                description: dto.description,
                normalBalance: dto.normalBalance || (dto.accountType === 'ASSET' || dto.accountType === 'EXPENSE' ? 'DEBIT' : 'CREDIT'),
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.chartOfAccount.update({ where: { id }, data: dto });
    }
    async softDelete(id) {
        const count = await this.prisma.journalLine.count({ where: { accountId: id } });
        if (count > 0) {
            throw new common_1.BadRequestException('Cannot delete an account with journal entries');
        }
        await this.prisma.chartOfAccount.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.ChartOfAccountsService = ChartOfAccountsService;
exports.ChartOfAccountsService = ChartOfAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChartOfAccountsService);
//# sourceMappingURL=chart-of-accounts.service.js.map