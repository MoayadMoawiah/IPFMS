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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const client_1 = require("@prisma/client");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllItems(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, warehouseId, categoryId } = query;
        const where = {
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
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOneItem(id) {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id, deletedAt: null },
            include: { category: true, warehouse: true, batches: { orderBy: { receivedDate: 'desc' } } },
        });
        if (!item)
            throw new common_1.NotFoundException(`Inventory item ${id} not found`);
        return item;
    }
    async createItem(dto) {
        return this.prisma.inventoryItem.create({
            data: {
                sku: dto.sku, name: dto.name, description: dto.description,
                categoryId: dto.categoryId, unit: dto.unit,
                reorderLevel: new client_1.Prisma.Decimal(dto.reorderLevel || '0'),
                warehouseId: dto.warehouseId,
            },
        });
    }
    async getMovements(itemId, query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)({ ...query, limit: query?.limit ?? 50 });
        const [data, total] = await Promise.all([
            this.prisma.stockMovement.findMany({
                where: { itemId },
                include: { warehouse: { select: { name: true } } },
                skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
            }),
            this.prisma.stockMovement.count({ where: { itemId } }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async issue(itemId, dto, userId) {
        const item = await this.findOneItem(itemId);
        if (Number(item.currentStock) < Number(dto.quantity)) {
            throw new common_1.NotFoundException('Insufficient stock');
        }
        const newBalance = Number(item.currentStock) - Number(dto.quantity);
        await Promise.all([
            this.prisma.inventoryItem.update({
                where: { id: itemId },
                data: { currentStock: new client_1.Prisma.Decimal(newBalance) },
            }),
            this.prisma.stockMovement.create({
                data: {
                    itemId, warehouseId: item.warehouseId || dto.warehouseId,
                    movementType: client_1.MovementType.ISSUE,
                    quantity: new client_1.Prisma.Decimal(dto.quantity),
                    unitCost: item.unitCost,
                    totalCost: new client_1.Prisma.Decimal(Number(dto.quantity) * Number(item.unitCost)),
                    balanceAfter: new client_1.Prisma.Decimal(newBalance),
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
    async findWarehouses(query) {
        return this.prisma.warehouse.findMany({
            where: { deletedAt: null, isActive: true },
            include: { _count: { select: { inventoryItems: true } } },
        });
    }
    async createWarehouse(dto) {
        return this.prisma.warehouse.create({ data: dto });
    }
    async getWarehouseStock(warehouseId) {
        return this.prisma.inventoryItem.findMany({
            where: { warehouseId, isActive: true, deletedAt: null },
            include: { category: { select: { name: true } } },
            orderBy: { name: 'asc' },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map