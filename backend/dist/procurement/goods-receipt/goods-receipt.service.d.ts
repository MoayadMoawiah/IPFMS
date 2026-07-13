import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class GoodsReceiptService {
    private readonly prisma;
    private readonly workflowSvc;
    private readonly serialSvc;
    private readonly auditSvc;
    constructor(prisma: PrismaService, workflowSvc: WorkflowService, serialSvc: SerialService, auditSvc: AuditService);
    findAll(query: any): Promise<{
        data: ({
            grant: {
                id: string;
                code: string;
            };
            po: {
                id: string;
                title: string;
                serialNumber: string;
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
            deletedAt: Date | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            notes: string | null;
            grantId: string;
            workflowInstanceId: string | null;
            serialNumber: string;
            poId: string;
            warehouseId: string | null;
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
    findOne(id: string): Promise<{
        grant: {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            description: string | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.GrantStatus;
            conditions: string | null;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            signedDate: Date | null;
            objectives: string | null;
            coverageArea: string | null;
            targetBeneficiaries: number | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
        warehouse: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            address: string | null;
            notes: string | null;
            managerId: string | null;
        } | null;
        workflow: ({
            steps: {
                comment: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                stepNumber: number;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                digitalSignatureId: string | null;
                instanceId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            templateId: string;
        }) | null;
        items: ({
            poItem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                budgetLineId: string | null;
                specification: string | null;
                unit: string;
                poId: string;
                orderedQuantity: Prisma.Decimal;
                receivedQuantity: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
                totalPrice: Prisma.Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            orderedQuantity: Prisma.Decimal;
            deliveredQuantity: Prisma.Decimal;
            acceptedQuantity: Prisma.Decimal;
            rejectedQuantity: Prisma.Decimal;
            damagedQuantity: Prisma.Decimal;
            poItemId: string;
            grnId: string;
        })[];
        po: {
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                budgetLineId: string | null;
                specification: string | null;
                unit: string;
                poId: string;
                orderedQuantity: Prisma.Decimal;
                receivedQuantity: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
                totalPrice: Prisma.Decimal;
            }[];
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            title: string;
            notes: string | null;
            grantId: string;
            workflowInstanceId: string | null;
            serialNumber: string;
            budgetLineId: string | null;
            prId: string | null;
            vendorId: string;
            rfqId: string | null;
            pafId: string | null;
            contractId: string | null;
            deliveryAddress: string | null;
            deliveryDate: Date | null;
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
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
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        notes: string | null;
        grantId: string;
        workflowInstanceId: string | null;
        serialNumber: string;
        poId: string;
        warehouseId: string | null;
        receiptDate: Date;
        deliveryNote: string | null;
        receivedById: string;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            orderedQuantity: Prisma.Decimal;
            deliveredQuantity: Prisma.Decimal;
            acceptedQuantity: Prisma.Decimal;
            rejectedQuantity: Prisma.Decimal;
            damagedQuantity: Prisma.Decimal;
            poItemId: string;
            grnId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        notes: string | null;
        grantId: string;
        workflowInstanceId: string | null;
        serialNumber: string;
        poId: string;
        warehouseId: string | null;
        receiptDate: Date;
        deliveryNote: string | null;
        receivedById: string;
    }>;
    submit(id: string, user: UserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        notes: string | null;
        grantId: string;
        workflowInstanceId: string | null;
        serialNumber: string;
        poId: string;
        warehouseId: string | null;
        receiptDate: Date;
        deliveryNote: string | null;
        receivedById: string;
    }>;
    approve(id: string, comment: string | undefined, user: UserPayload): Promise<{
        steps: {
            comment: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            action: string | null;
            stepNumber: number;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            dueAt: Date | null;
            digitalSignatureId: string | null;
            instanceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: string;
        documentId: string;
        currentStepNumber: number;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        templateId: string;
    }>;
    softDelete(id: string, user: UserPayload): Promise<void>;
}
