import { InventoryService } from './inventory.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
export declare class InventoryController {
    private readonly svc;
    constructor(svc: InventoryService);
    findAll(q: any): Promise<{
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
            totalValue: import(".prisma/client/runtime/library").Decimal;
            categoryId: string | null;
            sku: string;
            reorderLevel: import(".prisma/client/runtime/library").Decimal;
            currentStock: import(".prisma/client/runtime/library").Decimal;
            unitCost: import(".prisma/client/runtime/library").Decimal;
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
    create(dto: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        warehouseId: string | null;
        unit: string;
        totalValue: import(".prisma/client/runtime/library").Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    }>;
    lowStock(): Promise<({
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
        totalValue: import(".prisma/client/runtime/library").Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    })[]>;
    findOne(id: string): Promise<{
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
            quantity: import(".prisma/client/runtime/library").Decimal;
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
        totalValue: import(".prisma/client/runtime/library").Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    }>;
    movements(id: string, q: any): Promise<{
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
            quantity: import(".prisma/client/runtime/library").Decimal;
            unitCost: import(".prisma/client/runtime/library").Decimal;
            itemId: string;
            movementType: import(".prisma/client").$Enums.MovementType;
            totalCost: import(".prisma/client/runtime/library").Decimal;
            balanceAfter: import(".prisma/client/runtime/library").Decimal;
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
    issue(id: string, dto: any, user: UserPayload): Promise<{
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
            quantity: import(".prisma/client/runtime/library").Decimal;
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
        totalValue: import(".prisma/client/runtime/library").Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    }>;
    warehouses(q: any): Promise<({
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
    warehouseStock(id: string): Promise<({
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
        totalValue: import(".prisma/client/runtime/library").Decimal;
        categoryId: string | null;
        sku: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
    })[]>;
}
