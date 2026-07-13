import { InventoryService } from './inventory.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
export declare class InventoryController {
    private readonly svc;
    constructor(svc: InventoryService);
    findAll(q: any): Promise<{
        data: ({
            category: {
                name: string;
                id: string;
            } | null;
            warehouse: {
                name: string;
                id: string;
                code: string;
            } | null;
        } & {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            isActive: boolean;
            categoryId: string | null;
            warehouseId: string | null;
            locationCode: string | null;
            barcodeType: import(".prisma/client").$Enums.BarcodeType;
            barcodeValue: string | null;
            sku: string;
            unit: string;
            reorderLevel: import(".prisma/client/runtime/library").Decimal;
            currentStock: import(".prisma/client/runtime/library").Decimal;
            unitCost: import(".prisma/client/runtime/library").Decimal;
            totalValue: import(".prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: any): Promise<{
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        categoryId: string | null;
        warehouseId: string | null;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
        sku: string;
        unit: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        totalValue: import(".prisma/client/runtime/library").Decimal;
    }>;
    lowStock(): Promise<({
        warehouse: {
            name: string;
        } | null;
    } & {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        categoryId: string | null;
        warehouseId: string | null;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
        sku: string;
        unit: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        totalValue: import(".prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
        } | null;
        warehouse: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            isActive: boolean;
            notes: string | null;
            code: string;
            address: string | null;
            managerId: string | null;
        } | null;
        batches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            receivedDate: Date;
            itemId: string;
            batchNumber: string;
            expiryDate: Date | null;
            quantity: import(".prisma/client/runtime/library").Decimal;
        }[];
    } & {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        categoryId: string | null;
        warehouseId: string | null;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
        sku: string;
        unit: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        totalValue: import(".prisma/client/runtime/library").Decimal;
    }>;
    movements(id: string, q: any): Promise<{
        data: ({
            warehouse: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            grantId: string | null;
            reference: string | null;
            createdById: string | null;
            notes: string | null;
            warehouseId: string;
            unitCost: import(".prisma/client/runtime/library").Decimal;
            itemId: string;
            quantity: import(".prisma/client/runtime/library").Decimal;
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
        category: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
        } | null;
        warehouse: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            isActive: boolean;
            notes: string | null;
            code: string;
            address: string | null;
            managerId: string | null;
        } | null;
        batches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            receivedDate: Date;
            itemId: string;
            batchNumber: string;
            expiryDate: Date | null;
            quantity: import(".prisma/client/runtime/library").Decimal;
        }[];
    } & {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        categoryId: string | null;
        warehouseId: string | null;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
        sku: string;
        unit: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        totalValue: import(".prisma/client/runtime/library").Decimal;
    }>;
    warehouses(q: any): Promise<({
        _count: {
            inventoryItems: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        notes: string | null;
        code: string;
        address: string | null;
        managerId: string | null;
    })[]>;
    createWarehouse(dto: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        notes: string | null;
        code: string;
        address: string | null;
        managerId: string | null;
    }>;
    warehouseStock(id: string): Promise<({
        category: {
            name: string;
        } | null;
    } & {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        categoryId: string | null;
        warehouseId: string | null;
        locationCode: string | null;
        barcodeType: import(".prisma/client").$Enums.BarcodeType;
        barcodeValue: string | null;
        sku: string;
        unit: string;
        reorderLevel: import(".prisma/client/runtime/library").Decimal;
        currentStock: import(".prisma/client/runtime/library").Decimal;
        unitCost: import(".prisma/client/runtime/library").Decimal;
        totalValue: import(".prisma/client/runtime/library").Decimal;
    })[]>;
}
