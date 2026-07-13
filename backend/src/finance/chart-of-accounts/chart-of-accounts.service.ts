import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

@Injectable()
export class ChartOfAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination({ ...query, limit: query?.limit ?? 100 });
    const { search, accountType, isLeaf } = query;
    const where: any = {
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

    return buildPaginationResponse(data, total, page, limit);
  }

  async getTree() {
    const accounts = await this.prisma.chartOfAccount.findMany({
      where: { deletedAt: null },
      orderBy: { code: 'asc' },
    });

    // Build tree structure
    const map = new Map(accounts.map((a) => [a.id, { ...a, children: [] as any[] }]));
    const roots: any[] = [];

    for (const account of accounts) {
      if (account.parentId && map.has(account.parentId)) {
        map.get(account.parentId)!.children.push(map.get(account.id));
      } else if (!account.parentId) {
        roots.push(map.get(account.id));
      }
    }

    return { data: roots };
  }

  async findOne(id: string) {
    const account = await this.prisma.chartOfAccount.findUnique({
      where: { id, deletedAt: null },
      include: {
        parent: { select: { id: true, code: true, name: true } },
        children: { select: { id: true, code: true, name: true, isLeaf: true } },
      },
    });
    if (!account) throw new NotFoundException(`Account ${id} not found`);
    return account;
  }

  async getLedger(id: string, query: any) {
    const { page, limit } = parsePagination({ ...query, limit: query?.limit ?? 50 });
    const { startDate, endDate } = query;
    const where: any = {
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

  async create(dto: any) {
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

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.chartOfAccount.update({ where: { id }, data: dto });
  }

  async softDelete(id: string) {
    // Check if account has journal lines
    const count = await this.prisma.journalLine.count({ where: { accountId: id } });
    if (count > 0) {
      throw new BadRequestException('Cannot delete an account with journal entries');
    }
    await this.prisma.chartOfAccount.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
