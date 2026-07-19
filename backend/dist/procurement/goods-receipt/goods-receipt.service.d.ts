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
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            notes: string | null;
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
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.GrantStatus;
            conditions: string | null;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            signedDate: Date | null;
            objectives: string | null;
            reportingRequirements: string | null;
            targetBeneficiaries: number | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            coverageArea: string | null;
        };
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
        items: ({
            poItem: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                budgetLineId: string | null;
                poId: string;
                specification: string | null;
                unit: string;
                orderedQuantity: Prisma.Decimal;
                receivedQuantity: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
                totalPrice: Prisma.Decimal;
            };
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            orderedQuantity: Prisma.Decimal;
            deliveredQuantity: Prisma.Decimal;
            acceptedQuantity: Prisma.Decimal;
            rejectedQuantity: Prisma.Decimal;
            damagedQuantity: Prisma.Decimal;
            poItemId: string;
            grnId: string;
        })[];
        workflow: ({
            steps: ({
                digitalSignature: ({
                    user: {
                        id: string;
                        email: string;
                        firstName: string;
                        lastName: string;
                        roles: ({
                            role: {
                                id: string;
                                name: string;
                            };
                        } & {
                            userId: string;
                            roleId: string;
                            grantedBy: string | null;
                            grantedAt: Date;
                        })[];
                    };
                } & {
                    userId: string;
                    id: string;
                    createdAt: Date;
                    action: string;
                    ipAddress: string;
                    userAgent: string;
                    documentType: string;
                    documentId: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                }) | null;
            } & {
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
            })[];
            actions: ({
                actor: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                    roles: ({
                        role: {
                            id: string;
                            name: string;
                        };
                    } & {
                        userId: string;
                        roleId: string;
                        grantedBy: string | null;
                        grantedAt: Date;
                    })[];
                };
            } & {
                comment: string | null;
                id: string;
                action: import(".prisma/client").$Enums.WorkflowAction;
                digitalSignatureId: string | null;
                instanceId: string;
                actionAt: Date;
                instanceStepId: string | null;
                actorId: string;
            })[];
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
        po: {
            vendor: {
                id: string;
                name: string;
            };
            items: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                budgetLineId: string | null;
                poId: string;
                specification: string | null;
                unit: string;
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
            title: string;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            grantId: string;
            budgetLineId: string | null;
            workflowInstanceId: string | null;
            prId: string | null;
            rfqId: string | null;
            pafId: string | null;
            vendorId: string;
            contractId: string | null;
            deliveryAddress: string | null;
            deliveryDate: Date | null;
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            terms: string | null;
            notes: string | null;
            issuedById: string | null;
            issuedAt: Date | null;
        };
        receivedBy: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: ({
                role: {
                    id: string;
                    name: string;
                };
            } & {
                userId: string;
                roleId: string;
                grantedBy: string | null;
                grantedAt: Date;
            })[];
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        notes: string | null;
        poId: string;
        warehouseId: string | null;
        receiptDate: Date;
        deliveryNote: string | null;
        receivedById: string;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        items: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
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
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        notes: string | null;
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
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        notes: string | null;
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
