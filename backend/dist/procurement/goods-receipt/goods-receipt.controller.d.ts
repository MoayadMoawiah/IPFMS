import { GoodsReceiptService } from './goods-receipt.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class GoodsReceiptController {
    private readonly svc;
    constructor(svc: GoodsReceiptService);
    findAll(q: any): Promise<{
        data: ({
            grant: {
                id: string;
                code: string;
            };
            po: {
                id: string;
                serialNumber: string;
                title: string;
            };
            receivedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.DocumentStatus;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            notes: string | null;
            warehouseId: string | null;
            poId: string;
            receiptDate: Date;
            deliveryNote: string | null;
            receivedById: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: any, user: UserPayload): Promise<{
        items: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            deliveredQuantity: import(".prisma/client/runtime/library").Decimal;
            acceptedQuantity: import(".prisma/client/runtime/library").Decimal;
            rejectedQuantity: import(".prisma/client/runtime/library").Decimal;
            damagedQuantity: import(".prisma/client/runtime/library").Decimal;
            poItemId: string;
            grnId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        notes: string | null;
        warehouseId: string | null;
        poId: string;
        receiptDate: Date;
        deliveryNote: string | null;
        receivedById: string;
    }>;
    findOne(id: string): Promise<{
        grant: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.GrantStatus;
            deletedAt: Date | null;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            targetBeneficiaries: number | null;
            currency: string;
            createdById: string | null;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            objectives: string | null;
            conditions: string | null;
            coverageArea: string | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
        workflow: ({
            steps: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                status: import(".prisma/client").$Enums.StepStatus;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            templateId: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        }) | null;
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
        items: ({
            poItem: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                budgetLineId: string | null;
                unit: string;
                poId: string;
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                specification: string | null;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            deliveredQuantity: import(".prisma/client/runtime/library").Decimal;
            acceptedQuantity: import(".prisma/client/runtime/library").Decimal;
            rejectedQuantity: import(".prisma/client/runtime/library").Decimal;
            damagedQuantity: import(".prisma/client/runtime/library").Decimal;
            poItemId: string;
            grnId: string;
        })[];
        po: {
            items: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                budgetLineId: string | null;
                unit: string;
                poId: string;
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                specification: string | null;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.DocumentStatus;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            createdById: string | null;
            notes: string | null;
            budgetLineId: string | null;
            title: string;
            prId: string | null;
            rfqId: string | null;
            pafId: string | null;
            vendorId: string;
            contractId: string | null;
            deliveryAddress: string | null;
            deliveryDate: Date | null;
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
            terms: string | null;
            issuedById: string | null;
            issuedAt: Date | null;
        };
        receivedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        notes: string | null;
        warehouseId: string | null;
        poId: string;
        receiptDate: Date;
        deliveryNote: string | null;
        receivedById: string;
    }>;
    submit(id: string, user: UserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        notes: string | null;
        warehouseId: string | null;
        poId: string;
        receiptDate: Date;
        deliveryNote: string | null;
        receivedById: string;
    }>;
    approve(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            action: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            stepNumber: number;
            startedAt: Date | null;
            completedAt: Date | null;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            dueAt: Date | null;
            comment: string | null;
            digitalSignatureId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        templateId: string;
        documentType: string;
        documentId: string;
        currentStepNumber: number;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
}
