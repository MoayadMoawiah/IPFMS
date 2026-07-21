import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { MinioService } from '../../uploads/minio.service';
import { Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class GoodsReceiptService {
    private readonly prisma;
    private readonly workflowSvc;
    private readonly serialSvc;
    private readonly auditSvc;
    private readonly minioSvc;
    constructor(prisma: PrismaService, workflowSvc: WorkflowService, serialSvc: SerialService, auditSvc: AuditService, minioSvc: MinioService);
    findAll(query: any): Promise<{
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
            status: import(".prisma/client").$Enums.DocumentStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
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
    findOne(id: string, user?: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        grant: {
            id: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            createdById: string | null;
            conditions: string | null;
            deletedAt: Date | null;
            currency: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            objectives: string | null;
            coverageArea: string | null;
            targetBeneficiaries: number | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
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
                    id: string;
                    documentType: string;
                    documentId: string;
                    createdAt: Date;
                    action: string;
                    userId: string;
                    ipAddress: string;
                    userAgent: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                }) | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
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
                id: string;
                action: import(".prisma/client").$Enums.WorkflowAction;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceId: string;
                actionAt: Date;
                instanceStepId: string | null;
                actorId: string;
            })[];
        } & {
            id: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
        }) | null;
        items: ({
            poItem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
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
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            grnId: string;
            orderedQuantity: Prisma.Decimal;
            poItemId: string;
            deliveredQuantity: Prisma.Decimal;
            acceptedQuantity: Prisma.Decimal;
            rejectedQuantity: Prisma.Decimal;
            damagedQuantity: Prisma.Decimal;
        })[];
        po: {
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                budgetLineId: string | null;
                poId: string;
                specification: string | null;
                unit: string;
                orderedQuantity: Prisma.Decimal;
                receivedQuantity: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
                totalPrice: Prisma.Decimal;
            }[];
            vendor: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            budgetLineId: string | null;
            title: string;
            currency: string;
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
        warehouse: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            deletedAt: Date | null;
            notes: string | null;
            code: string;
            address: string | null;
            managerId: string | null;
        } | null;
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
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            grnId: string;
            orderedQuantity: Prisma.Decimal;
            poItemId: string;
            deliveredQuantity: Prisma.Decimal;
            acceptedQuantity: Prisma.Decimal;
            rejectedQuantity: Prisma.Decimal;
            damagedQuantity: Prisma.Decimal;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
    update(id: string, dto: any, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        grant: {
            id: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            createdById: string | null;
            conditions: string | null;
            deletedAt: Date | null;
            currency: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            objectives: string | null;
            coverageArea: string | null;
            targetBeneficiaries: number | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
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
                    id: string;
                    documentType: string;
                    documentId: string;
                    createdAt: Date;
                    action: string;
                    userId: string;
                    ipAddress: string;
                    userAgent: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                }) | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
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
                id: string;
                action: import(".prisma/client").$Enums.WorkflowAction;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceId: string;
                actionAt: Date;
                instanceStepId: string | null;
                actorId: string;
            })[];
        } & {
            id: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
        }) | null;
        items: ({
            poItem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
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
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            grnId: string;
            orderedQuantity: Prisma.Decimal;
            poItemId: string;
            deliveredQuantity: Prisma.Decimal;
            acceptedQuantity: Prisma.Decimal;
            rejectedQuantity: Prisma.Decimal;
            damagedQuantity: Prisma.Decimal;
        })[];
        po: {
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                budgetLineId: string | null;
                poId: string;
                specification: string | null;
                unit: string;
                orderedQuantity: Prisma.Decimal;
                receivedQuantity: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
                totalPrice: Prisma.Decimal;
            }[];
            vendor: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            budgetLineId: string | null;
            title: string;
            currency: string;
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
        warehouse: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            deletedAt: Date | null;
            notes: string | null;
            code: string;
            address: string | null;
            managerId: string | null;
        } | null;
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
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
            id: string;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
            instanceId: string;
        }[];
    } & {
        id: string;
        documentType: string;
        documentId: string;
        currentStepNumber: number;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
    }>;
    reject(id: string, comment: string, user: UserPayload): Promise<{
        steps: {
            id: string;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
            instanceId: string;
        }[];
    } & {
        id: string;
        documentType: string;
        documentId: string;
        currentStepNumber: number;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
    }>;
    return_(id: string, comment: string, user: UserPayload): Promise<{
        steps: {
            id: string;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
            instanceId: string;
        }[];
    } & {
        id: string;
        documentType: string;
        documentId: string;
        currentStepNumber: number;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
    }>;
    uploadDocuments(grnId: string, files: Express.Multer.File[], labels: string[], user: UserPayload): Promise<any[]>;
    listDocuments(grnId: string): Promise<({
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        documentType: string;
        documentId: string;
        createdAt: Date;
        deletedAt: Date | null;
        fileUrl: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteDocument(grnId: string, attachmentId: string, user: UserPayload): Promise<void>;
    softDelete(id: string, user: UserPayload): Promise<void>;
}
