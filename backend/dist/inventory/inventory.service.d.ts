import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllItems(query: any): Promise<{
        data: ({
            warehouse: {
                id: string;
                name: string;
                code: string;
            } | null;
            category: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            deletedAt: Date | null;
            warehouseId: string | null;
            unit: string;
            totalValue: Prisma.Decimal;
            categoryId: string | null;
            sku: string;
            reorderLevel: Prisma.Decimal;
            currentStock: Prisma.Decimal;
            unitCost: Prisma.Decimal;
            locationCode: string | null;
            barcodeType: import(".prisma/client").$Enums.BarcodeType;
            barcodeValue: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneItem(id: string): Promise<{
        warehouse: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            address: string | null;
            managerId: string | null;
        } | null;
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            code: string;
        } | null;
        batches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            quantity: Prisma.Decimal;
            expiryDate: Date | null;
            receivedDate: Date;
            itemId: string;
            batchNumber: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        warehouseId: string | null;
        unit: string;
        totalValue: Prisma.Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: Prisma.Decimal;
        currentStock: Prisma.Decimal;
        unitCost: Prisma.Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    }>;
    createItem(dto: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        warehouseId: string | null;
        unit: string;
        totalValue: Prisma.Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: Prisma.Decimal;
        currentStock: Prisma.Decimal;
        unitCost: Prisma.Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    }>;
    getMovements(itemId: string, query: any): Promise<{
        data: ({
            warehouse: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            createdById: string | null;
            grantId: string | null;
            notes: string | null;
            warehouseId: string;
            reference: string | null;
            quantity: Prisma.Decimal;
            unitCost: Prisma.Decimal;
            itemId: string;
            movementType: import(".prisma/client").$Enums.MovementType;
            totalCost: Prisma.Decimal;
            balanceAfter: Prisma.Decimal;
            referenceId: string | null;
            referenceType: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    issue(itemId: string, dto: any, userId: string): Promise<{
        warehouse: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            address: string | null;
            managerId: string | null;
        } | null;
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            code: string;
        } | null;
        batches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            quantity: Prisma.Decimal;
            expiryDate: Date | null;
            receivedDate: Date;
            itemId: string;
            batchNumber: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        warehouseId: string | null;
        unit: string;
        totalValue: Prisma.Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: Prisma.Decimal;
        currentStock: Prisma.Decimal;
        unitCost: Prisma.Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    }>;
    getLowStock(): Promise<({
        warehouse: {
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        warehouseId: string | null;
        unit: string;
        totalValue: Prisma.Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: Prisma.Decimal;
        currentStock: Prisma.Decimal;
        unitCost: Prisma.Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    })[]>;
    findWarehouses(query: any): Promise<({
        _count: {
            inventoryItems: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        code: string;
        notes: string | null;
        address: string | null;
        managerId: string | null;
    })[]>;
    createWarehouse(dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        code: string;
        notes: string | null;
        address: string | null;
        managerId: string | null;
    }>;
    getWarehouseStock(warehouseId: string): Promise<({
        category: {
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        warehouseId: string | null;
        unit: string;
        totalValue: Prisma.Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: Prisma.Decimal;
        currentStock: Prisma.Decimal;
        unitCost: Prisma.Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    })[]>;
}
