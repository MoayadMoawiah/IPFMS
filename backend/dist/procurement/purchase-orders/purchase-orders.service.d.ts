import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { GrantsService } from '../../grants/grants.service';
import { MinioService } from '../../uploads/minio.service';
import { Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class PurchaseOrdersService {
    private readonly prisma;
    private readonly workflowSvc;
    private readonly serialSvc;
    private readonly auditSvc;
    private readonly grantsSvc;
    private readonly minioSvc;
    constructor(prisma: PrismaService, workflowSvc: WorkflowService, serialSvc: SerialService, auditSvc: AuditService, grantsSvc: GrantsService, minioSvc: MinioService);
    findAll(query: any): Promise<{
        data: ({
            grant: {
                id: string;
                name: string;
                code: string;
            };
            vendor: {
                id: string;
                name: string;
            };
            _count: {
                goodsReceipts: number;
                items: number;
            };
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            grantId: string;
            budgetLineId: string | null;
            title: string;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    private readonly userWithRoles;
    private readonly poDetailInclude;
    private resolvePurchaseOrderId;
    findOne(id: string, user?: UserPayload): Promise<{
        createdBy: {
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
        } | null;
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
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
        vendor: {
            bankAccounts: {
                currency: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                vendorId: string;
                country: string | null;
                isPrimary: boolean;
                accountNumber: string;
                bankName: string;
                accountName: string;
                iban: string | null;
                swiftCode: string | null;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            arabicName: string | null;
            phone: string | null;
            deletedAt: Date | null;
            createdById: string | null;
            country: string | null;
            address: string | null;
            website: string | null;
            registrationNumber: string;
            vendorType: import(".prisma/client").$Enums.VendorType;
            city: string | null;
            taxNumber: string | null;
            isBlacklisted: boolean;
            blacklistReason: string | null;
            blacklistDate: Date | null;
            rating: Prisma.Decimal;
        };
        rfq: {
            id: string;
            status: import(".prisma/client").$Enums.RfqStatus;
            serialNumber: string;
            title: string;
        } | null;
        goodsReceipts: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            receiptDate: Date;
        }[];
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
            template: {
                id: string;
            };
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
        pr: {
            id: string;
            serialNumber: string;
            title: string;
            requestedBy: {
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
        } | null;
        paf: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            recommendedVendorId: string | null;
        } | null;
        invoices: {
            currency: string;
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            totalAmount: Prisma.Decimal;
        }[];
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
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
    }>;
    create(dto: any, user: UserPayload): Promise<{
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
        vendor: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            arabicName: string | null;
            phone: string | null;
            deletedAt: Date | null;
            createdById: string | null;
            country: string | null;
            address: string | null;
            website: string | null;
            registrationNumber: string;
            vendorType: import(".prisma/client").$Enums.VendorType;
            city: string | null;
            taxNumber: string | null;
            isBlacklisted: boolean;
            blacklistReason: string | null;
            blacklistDate: Date | null;
            rating: Prisma.Decimal;
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
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
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
    }>;
    submit(id: string, user: UserPayload): Promise<{
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
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
    }>;
    approve(id: string, comment: string | undefined, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
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
        };
    }>;
    reject(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
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
        };
    }>;
    return_(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
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
        };
    }>;
    private processWorkflowAction;
    issue(id: string, user: UserPayload): Promise<{
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
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
    }>;
    getPaymentStatus(id: string): Promise<{
        totalAmount: number;
        paidAmount: number;
        remainingAmount: number;
        paymentPercent: number;
    }>;
    softDelete(id: string, user: UserPayload): Promise<void>;
    uploadDocuments(poId: string, files: Express.Multer.File[], labels: string[], user: UserPayload): Promise<any[]>;
    listDocuments(poId: string): Promise<({
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        documentType: string;
        documentId: string;
        fileUrl: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteDocument(poId: string, attachmentId: string, user: UserPayload): Promise<void>;
}
