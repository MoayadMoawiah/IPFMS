import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SerialService } from '../serial/serial.service';
import { AuditService } from '../audit/audit.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../common/dto/pagination.dto';
import { Prisma, DepreciationMethod } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, categoryId, grantId } = query;
    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(grantId && { grantId }),
      ...(search && { OR: [{ assetCode: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] }),
    };

    const [data, total] = await Promise.all([
      this.prisma.fixedAsset.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, code: true } },
          grant: { select: { id: true, code: true } },
        },
        skip: (page - 1) * limit, take: limit, orderBy: { assetCode: 'asc' },
      }),
      this.prisma.fixedAsset.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const asset = await this.prisma.fixedAsset.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        grant: true,
        assignments: { include: { assignedTo: { select: { firstName: true, lastName: true } } } },
        maintenance: { orderBy: { scheduledDate: 'desc' } },
        depSchedules: { orderBy: { period: 'asc' } },
        verifications: { orderBy: { verificationDate: 'desc' } },
      },
    });
    if (!asset) throw new NotFoundException(`Asset ${id} not found`);
    return asset;
  }

  async create(dto: any, user: UserPayload) {
    const category = await this.prisma.assetCategory.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Asset category not found');

    const grantCode = dto.grantId ? (await this.prisma.grant.findUnique({ where: { id: dto.grantId }, select: { code: true } }))?.code : 'SYS';
    const serialNumber = await this.serialSvc.next(grantCode || 'SYS', 'PR'); // Using placeholder, will use dedicated asset serial

    const assetCode = `AST-${Date.now().toString(36).toUpperCase()}`;

    const asset = await this.prisma.fixedAsset.create({
      data: {
        serialNumber: assetCode,
        assetCode,
        name: dto.name,
        description: dto.description,
        categoryId: dto.categoryId,
        grantId: dto.grantId,
        purchaseDate: new Date(dto.purchaseDate),
        purchasePrice: new Prisma.Decimal(dto.purchasePrice),
        currency: dto.currency || 'USD',
        currentBookValue: new Prisma.Decimal(dto.purchasePrice),
        depreciationMethod: dto.depreciationMethod || DepreciationMethod.STRAIGHT_LINE,
        usefulLifeYears: dto.usefulLifeYears || category.usefulLifeYears,
        residualValue: new Prisma.Decimal(dto.residualValue || '0'),
        depreciationStartDate: new Date(dto.depreciationStartDate || dto.purchaseDate),
        warehouseId: dto.warehouseId,
        locationCode: dto.locationCode,
        status: 'ACTIVE',
        createdById: user.id,
      },
    });

    // Generate depreciation schedule
    await this.generateDepreciationSchedule(asset.id);

    await this.auditSvc.log({
      userId: user.id, action: 'CREATE', module: 'ASSETS', resource: 'FixedAsset',
      resourceId: asset.id, newValues: { assetCode, name: asset.name },
    });

    return asset;
  }

  async assign(assetId: string, dto: any, user: UserPayload) {
    await this.findOne(assetId);
    return this.prisma.assetAssignment.create({
      data: {
        assetId,
        assignedToId: dto.assignedToId,
        departmentId: dto.departmentId,
        assignedDate: new Date(dto.assignedDate || Date.now()),
        condition: dto.condition || 'GOOD',
        notes: dto.notes,
        assignedById: user.id,
      },
    });
  }

  async depreciate(assetId: string, periodId: string, user: UserPayload) {
    const asset = await this.findOne(assetId);
    const schedule = await this.prisma.assetDepreciationSchedule.findFirst({
      where: { assetId, isPosted: false },
      orderBy: { period: 'asc' },
    });

    if (!schedule) throw new BadRequestException('No pending depreciation for this asset');

    await this.prisma.assetDepreciationSchedule.update({
      where: { id: schedule.id },
      data: { isPosted: true, postedAt: new Date() },
    });

    await this.prisma.fixedAsset.update({
      where: { id: assetId },
      data: {
        currentBookValue: new Prisma.Decimal(Number(schedule.bookValue)),
        lastDepreciationDate: schedule.period,
      },
    });

    return schedule;
  }

  async getCategories() {
    return this.prisma.assetCategory.findMany({ orderBy: { code: 'asc' } });
  }

  async createCategory(dto: any) {
    return this.prisma.assetCategory.create({
      data: {
        name: dto.name, code: dto.code, parentId: dto.parentId,
        depreciationMethod: dto.depreciationMethod || 'STRAIGHT_LINE',
        usefulLifeYears: dto.usefulLifeYears || 5,
        residualValuePercent: new Prisma.Decimal(dto.residualValuePercent || '0'),
      },
    });
  }

  async getDepreciationSchedule(assetId: string) {
    return this.prisma.assetDepreciationSchedule.findMany({
      where: { assetId },
      orderBy: { period: 'asc' },
    });
  }

  private async generateDepreciationSchedule(assetId: string) {
    const asset = await this.prisma.fixedAsset.findUnique({ where: { id: assetId } });
    if (!asset) return;

    const purchasePrice = Number(asset.purchasePrice);
    const residualValue = Number(asset.residualValue);
    const usefulLife = asset.usefulLifeYears;
    const annualDepreciation = (purchasePrice - residualValue) / usefulLife;
    const monthlyDepreciation = annualDepreciation / 12;

    const schedules = [];
    let bookValue = purchasePrice;
    let accumulated = 0;
    const startDate = new Date(asset.depreciationStartDate);

    for (let i = 0; i < usefulLife * 12; i++) {
      const period = new Date(startDate);
      period.setMonth(period.getMonth() + i);

      if (bookValue <= residualValue) break;

      const depr = Math.min(monthlyDepreciation, bookValue - residualValue);
      accumulated += depr;
      bookValue -= depr;

      schedules.push({
        assetId,
        period,
        depreciationAmount: new Prisma.Decimal(depr.toFixed(4)),
        accumulatedDepreciation: new Prisma.Decimal(accumulated.toFixed(4)),
        bookValue: new Prisma.Decimal(bookValue.toFixed(4)),
        isPosted: false,
      });
    }

    if (schedules.length > 0) {
      await this.prisma.assetDepreciationSchedule.createMany({ data: schedules });
    }
  }

  async softDelete(id: string, user: UserPayload) {
    await this.findOne(id);
    await this.prisma.fixedAsset.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
