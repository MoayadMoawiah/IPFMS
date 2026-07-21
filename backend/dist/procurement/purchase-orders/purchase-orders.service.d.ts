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
            _count: {
                goodsReceipts: number;
                items: number;
            };
            grant: {
                id: string;
                name: string;
                code: string;
            };
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
        goodsReceipts: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            receiptDate: Date;
        }[];
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
            template: {
                id: string;
            };
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
        rfq: {
            id: string;
            status: import(".prisma/client").$Enums.RfqStatus;
            serialNumber: string;
            title: string;
        } | null;
        paf: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            recommendedVendorId: string | null;
        } | null;
        vendor: {
            bankAccounts: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                currency: string;
                vendorId: string;
                country: string | null;
                accountName: string;
                bankName: string;
                accountNumber: string;
                iban: string | null;
                swiftCode: string | null;
                isPrimary: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            createdById: string | null;
            email: string | null;
            arabicName: string | null;
            phone: string | null;
            deletedAt: Date | null;
            registrationNumber: string;
            vendorType: import(".prisma/client").$Enums.VendorType;
            country: string | null;
            address: string | null;
            city: string | null;
            website: string | null;
            taxNumber: string | null;
            isBlacklisted: boolean;
            blacklistReason: string | null;
            blacklistDate: Date | null;
            rating: Prisma.Decimal;
        };
        invoices: {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            currency: string;
            totalAmount: Prisma.Decimal;
        }[];
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
    }>;
    create(dto: any, user: UserPayload): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            name: string;
            createdById: string | null;
            email: string | null;
            arabicName: string | null;
            phone: string | null;
            deletedAt: Date | null;
            registrationNumber: string;
            vendorType: import(".prisma/client").$Enums.VendorType;
            country: string | null;
            address: string | null;
            city: string | null;
            website: string | null;
            taxNumber: string | null;
            isBlacklisted: boolean;
            blacklistReason: string | null;
            blacklistDate: Date | null;
            rating: Prisma.Decimal;
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
    }>;
    submit(id: string, user: UserPayload): Promise<{
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
    }>;
    approve(id: string, comment: string | undefined, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
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
        };
    }>;
    reject(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
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
        };
    }>;
    return_(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
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
        };
    }>;
    private processWorkflowAction;
    issue(id: string, user: UserPayload): Promise<{
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
    deleteDocument(poId: string, attachmentId: string, user: UserPayload): Promise<void>;
}
