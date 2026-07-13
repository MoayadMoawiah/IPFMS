import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { JournalStatus, Prisma } from '@prisma/client';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

@Injectable()
export class JournalEntriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, grantId, periodId } = query;
    const where: any = {
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

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
      include: {
        lines: { include: { account: { select: { id: true, code: true, name: true } } } },
        grant: { select: { id: true, code: true, name: true } },
        period: true,
        postedBy: { select: { firstName: true, lastName: true } },
      },
    });
    if (!entry) throw new NotFoundException(`Journal Entry ${id} not found`);
    return entry;
  }

  async create(dto: any, user: UserPayload) {
    // Validate debit = credit
    const totalDebit = dto.lines?.reduce((sum: number, l: any) => sum + Number(l.debitAmount || 0), 0) || 0;
    const totalCredit = dto.lines?.reduce((sum: number, l: any) => sum + Number(l.creditAmount || 0), 0) || 0;

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(
        `Journal entry is not balanced. Debit: ${totalDebit.toFixed(2)}, Credit: ${totalCredit.toFixed(2)}`,
      );
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
        totalDebit: new Prisma.Decimal(totalDebit),
        totalCredit: new Prisma.Decimal(totalCredit),
        status: JournalStatus.DRAFT,
        createdById: user.id,
        lines: {
          create: dto.lines.map((line: any, idx: number) => ({
            accountId: line.accountId,
            description: line.description,
            debitAmount: new Prisma.Decimal(line.debitAmount || '0'),
            creditAmount: new Prisma.Decimal(line.creditAmount || '0'),
            currency: line.currency || dto.currency || 'USD',
            exchangeRate: new Prisma.Decimal(line.exchangeRate || '1'),
            baseDebit: new Prisma.Decimal(Number(line.debitAmount || 0) * Number(line.exchangeRate || 1)),
            baseCredit: new Prisma.Decimal(Number(line.creditAmount || 0) * Number(line.exchangeRate || 1)),
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

  async post(id: string, user: UserPayload) {
    const entry = await this.findOne(id);
    if (entry.status !== JournalStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT journal entries can be posted');
    }

    // Check period is open
    const period = await this.prisma.accountingPeriod.findUnique({ where: { id: entry.periodId } });
    if (period?.status !== 'OPEN') {
      throw new BadRequestException('Accounting period is closed');
    }

    const updated = await this.prisma.journalEntry.update({
      where: { id },
      data: {
        status: JournalStatus.POSTED,
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

  async reverse(id: string, user: UserPayload) {
    const entry = await this.findOne(id);
    if (entry.status !== JournalStatus.POSTED) {
      throw new BadRequestException('Only POSTED entries can be reversed');
    }
    if (entry.isReversed) {
      throw new BadRequestException('Entry is already reversed');
    }

    // Create reversal entry with flipped debits/credits
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
        status: JournalStatus.POSTED,
        isPosted: true,
        postedAt: new Date(),
        postedById: user.id,
        reversedById: entry.id,
        createdById: user.id,
        lines: {
          create: (entry.lines as any).map((line: any, idx: number) => ({
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
      data: { isReversed: true, status: JournalStatus.REVERSED },
    });

    return reversal;
  }

  async getTrialBalance(periodId?: string, grantId?: string) {
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

    const accountMap = new Map<string, { account: any; totalDebit: number; totalCredit: number }>();

    for (const line of lines) {
      const key = line.accountId;
      if (!accountMap.has(key)) {
        accountMap.set(key, { account: line.account, totalDebit: 0, totalCredit: 0 });
      }
      const entry = accountMap.get(key)!;
      entry.totalDebit += Number(line.debitAmount);
      entry.totalCredit += Number(line.creditAmount);
    }

    const trialBalance = Array.from(accountMap.values())
      .map((entry) => ({
        ...entry.account,
        totalDebit: entry.totalDebit,
        totalCredit: entry.totalCredit,
        balance:
          entry.account.normalBalance === 'DEBIT'
            ? entry.totalDebit - entry.totalCredit
            : entry.totalCredit - entry.totalDebit,
      }))
      .sort((a, b) => a.code.localeCompare(b.code));

    const totals = {
      totalDebit: trialBalance.reduce((s, a) => s + a.totalDebit, 0),
      totalCredit: trialBalance.reduce((s, a) => s + a.totalCredit, 0),
      isBalanced: Math.abs(
        trialBalance.reduce((s, a) => s + a.totalDebit, 0) -
        trialBalance.reduce((s, a) => s + a.totalCredit, 0)
      ) < 0.01,
    };

    return { data: { accounts: trialBalance, totals } };
  }
}
