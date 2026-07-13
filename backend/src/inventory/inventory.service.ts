import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildPaginationResponse, parsePagination } from '../common/dto/pagination.dto';
import { Prisma, MovementType } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllItems(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, warehouseId, categoryId } = query;
    const where: any = {
      deletedAt: null, isActive: true,
      ...(warehouseId && { warehouseId }),
      ...(categoryId && { categoryId }),
      ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }] }),
    };

    const [data, total] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          warehouse: { select: { id: true, name: true, code: true } },
        },
        skip: (page - 1) * limit, take: limit, orderBy: { name: 'asc' },
      }),
      this.prisma.inventoryItem.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOneItem(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id, deletedAt: null },
      include: { category: true, warehouse: true, batches: { orderBy: { receivedDate: 'desc' } } },
    });
    if (!item) throw new NotFoundException(`Inventory item ${id} not found`);
    return item;
  }

  async createItem(dto: any) {
    return this.prisma.inventoryItem.create({
      data: {
        sku: dto.sku, name: dto.name, description: dto.description,
        categoryId: dto.categoryId, unit: dto.unit,
        reorderLevel: new Prisma.Decimal(dto.reorderLevel || '0'),
        warehouseId: dto.warehouseId,
      },
    });
  }

  async getMovements(itemId: string, query: any) {
    const { page, limit } = parsePagination({ ...query, limit: query?.limit ?? 50 });
    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where: { itemId },
        include: { warehouse: { select: { name: true } } },
        skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockMovement.count({ where: { itemId } }),
    ]);
    return buildPaginationResponse(data, total, page, limit);
  }

  async issue(itemId: string, dto: any, userId: string) {
    const item = await this.findOneItem(itemId);
    if (Number(item.currentStock) < Number(dto.quantity)) {
      throw new NotFoundException('Insufficient stock');
    }
    const newBalance = Number(item.currentStock) - Number(dto.quantity);
    await Promise.all([
      this.prisma.inventoryItem.update({
        where: { id: itemId },
        data: { currentStock: new Prisma.Decimal(newBalance) },
      }),
      this.prisma.stockMovement.create({
        data: {
          itemId, warehouseId: item.warehouseId || dto.warehouseId,
          movementType: MovementType.ISSUE,
          quantity: new Prisma.Decimal(dto.quantity),
          unitCost: item.unitCost,
          totalCost: new Prisma.Decimal(Number(dto.quantity) * Number(item.unitCost)),
          balanceAfter: new Prisma.Decimal(newBalance),
          reference: dto.reference, notes: dto.notes,
          grantId: dto.grantId, createdById: userId,
        },
      }),
    ]);
    return item;
  }

  async getLowStock() {
    return this.prisma.inventoryItem.findMany({
      where: { isActive: true, deletedAt: null, currentStock: { lte: this.prisma.inventoryItem.fields.reorderLevel } },
      include: { warehouse: { select: { name: true } } },
    });
  }

  async findWarehouses(query: any) {
    return this.prisma.warehouse.findMany({
      where: { deletedAt: null, isActive: true },
      include: { _count: { select: { inventoryItems: true } } },
    });
  }

  async createWarehouse(dto: any) {
    return this.prisma.warehouse.create({ data: dto });
  }

  async getWarehouseStock(warehouseId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { warehouseId, isActive: true, deletedAt: null },
      include: { category: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
  }
}
