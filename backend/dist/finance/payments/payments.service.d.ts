import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { MinioService } from '../../uploads/minio.service';
import { Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class PaymentsService {
    private readonly prisma;
    private readonly workflowSvc;
    private readonly serialSvc;
    private readonly auditSvc;
    private readonly minioSvc;
    constructor(prisma: PrismaService, workflowSvc: WorkflowService, serialSvc: SerialService, auditSvc: AuditService, minioSvc: MinioService);
    private requireText;
    private normalizeMethodDetails;
    private hasSignedCashReceipt;
    findAllPaymentRequests(query: any): Promise<{
        data: ({
            grant: {
                id: string;
                name: string;
                code: string;
            };
            invoice: {
                vendor: {
                    id: string;
                    name: string;
                };
                id: string;
                status: import(".prisma/client").$Enums.InvoiceStatus;
                serialNumber: string;
                invoiceNumber: string;
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
            workflowInstanceId: string | null;
            totalAmount: Prisma.Decimal;
            notes: string | null;
            invoiceId: string;
            requestDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            methodDetails: Prisma.JsonValue | null;
            bankAccountId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOnePaymentRequest(id: string, user?: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        grant: {
            id: string;
            name: string;
            code: string;
        };
        bankAccount: {
            id: string;
            bankName: string;
            accountName: string;
        } | null;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: Prisma.Decimal;
        }[];
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            notes: string | null;
            poId: string;
            grnId: string | null;
            invoiceNumber: string;
            invoiceDate: Date;
            dueDate: Date | null;
            isThreeWayMatched: boolean;
            matchedAt: Date | null;
            matchedById: string | null;
            fileUrl: string | null;
        };
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        totalAmount: Prisma.Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: Prisma.JsonValue | null;
        bankAccountId: string | null;
    }>;
    createPaymentRequest(dto: any, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        grant: {
            id: string;
            name: string;
            code: string;
        };
        bankAccount: {
            id: string;
            bankName: string;
            accountName: string;
        } | null;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: Prisma.Decimal;
        }[];
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            notes: string | null;
            poId: string;
            grnId: string | null;
            invoiceNumber: string;
            invoiceDate: Date;
            dueDate: Date | null;
            isThreeWayMatched: boolean;
            matchedAt: Date | null;
            matchedById: string | null;
            fileUrl: string | null;
        };
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        totalAmount: Prisma.Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: Prisma.JsonValue | null;
        bankAccountId: string | null;
    }>;
    updatePaymentRequest(id: string, dto: any, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        grant: {
            id: string;
            name: string;
            code: string;
        };
        bankAccount: {
            id: string;
            bankName: string;
            accountName: string;
        } | null;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: Prisma.Decimal;
        }[];
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            notes: string | null;
            poId: string;
            grnId: string | null;
            invoiceNumber: string;
            invoiceDate: Date;
            dueDate: Date | null;
            isThreeWayMatched: boolean;
            matchedAt: Date | null;
            matchedById: string | null;
            fileUrl: string | null;
        };
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        totalAmount: Prisma.Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: Prisma.JsonValue | null;
        bankAccountId: string | null;
    }>;
    submitPaymentRequest(id: string, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        grant: {
            id: string;
            name: string;
            code: string;
        };
        bankAccount: {
            id: string;
            bankName: string;
            accountName: string;
        } | null;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: Prisma.Decimal;
        }[];
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            notes: string | null;
            poId: string;
            grnId: string | null;
            invoiceNumber: string;
            invoiceDate: Date;
            dueDate: Date | null;
            isThreeWayMatched: boolean;
            matchedAt: Date | null;
            matchedById: string | null;
            fileUrl: string | null;
        };
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        totalAmount: Prisma.Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: Prisma.JsonValue | null;
        bankAccountId: string | null;
    }>;
    approvePaymentRequest(id: string, comment: string | undefined, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        grant: {
            id: string;
            name: string;
            code: string;
        };
        bankAccount: {
            id: string;
            bankName: string;
            accountName: string;
        } | null;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: Prisma.Decimal;
        }[];
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
            notes: string | null;
            poId: string;
            grnId: string | null;
            invoiceNumber: string;
            invoiceDate: Date;
            dueDate: Date | null;
            isThreeWayMatched: boolean;
            matchedAt: Date | null;
            matchedById: string | null;
            fileUrl: string | null;
        };
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        totalAmount: Prisma.Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: Prisma.JsonValue | null;
        bankAccountId: string | null;
    }>;
    getCashReceipt(id: string): Promise<{
        title: string;
        organizationName: string;
        organizationShortName: string | null;
        requestSerial: string;
        requestDate: Date;
        amount: Prisma.Decimal;
        currency: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        vendorName: string;
        invoiceNumber: string;
        invoiceSerial: string;
        grantCode: string;
        grantName: string;
        paidToName: any;
        notes: string | null;
        signatureLines: {
            recipient: string;
            cashier: string;
            date: string;
        };
    }>;
    uploadPaymentRequestDocuments(requestId: string, files: Express.Multer.File[], labels: string[], user: UserPayload): Promise<any[]>;
    listPaymentRequestDocuments(requestId: string): Promise<({
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
    deletePaymentRequestDocument(requestId: string, attachmentId: string, user: UserPayload): Promise<void>;
    findAllVouchers(query: any): Promise<{
        data: ({
            grant: {
                id: string;
                code: string;
            };
        } & {
            currency: string;
            exchangeRate: Prisma.Decimal;
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            grantId: string;
            workflowInstanceId: string | null;
            paymentRequestId: string | null;
            payeeType: import(".prisma/client").$Enums.PayeeType;
            payeeId: string | null;
            payeeName: string;
            paymentDate: Date;
            amount: Prisma.Decimal;
            baseAmount: Prisma.Decimal;
            reference: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneVoucher(id: string, user?: UserPayload): Promise<{
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
        paymentRequest: ({
            invoice: {
                vendor: {
                    id: string;
                    name: string;
                };
            } & {
                currency: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdById: string | null;
                status: import(".prisma/client").$Enums.InvoiceStatus;
                serialNumber: string;
                grantId: string;
                workflowInstanceId: string | null;
                vendorId: string;
                subtotal: Prisma.Decimal;
                taxAmount: Prisma.Decimal;
                totalAmount: Prisma.Decimal;
                paidAmount: Prisma.Decimal;
                notes: string | null;
                poId: string;
                grnId: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                dueDate: Date | null;
                isThreeWayMatched: boolean;
                matchedAt: Date | null;
                matchedById: string | null;
                fileUrl: string | null;
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
            workflowInstanceId: string | null;
            totalAmount: Prisma.Decimal;
            notes: string | null;
            invoiceId: string;
            requestDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            methodDetails: Prisma.JsonValue | null;
            bankAccountId: string | null;
        }) | null;
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
        payments: ({
            cheques: {
                currency: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ChequeStatus;
                serialNumber: string;
                issuedAt: Date | null;
                payeeName: string;
                amount: Prisma.Decimal;
                bankAccountId: string;
                fileUrl: string | null;
                chequeNumber: string;
                chequeDate: Date;
                memo: string | null;
                printedAt: Date | null;
                clearedAt: Date | null;
                paymentId: string;
            }[];
            bankTransfers: {
                currency: string;
                exchangeRate: Prisma.Decimal;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.BankTransferStatus;
                completedAt: Date | null;
                serialNumber: string;
                amount: Prisma.Decimal;
                baseAmount: Prisma.Decimal;
                reference: string | null;
                fileUrl: string | null;
                paymentId: string;
                toBankAccount: string;
                toBankName: string;
                toAccountName: string;
                transferDate: Date;
                swiftRef: string | null;
                fromBankAccountId: string;
            }[];
        } & {
            currency: string;
            exchangeRate: Prisma.Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.PaymentStatus;
            paymentDate: Date;
            amount: Prisma.Decimal;
            baseAmount: Prisma.Decimal;
            reference: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            bankAccountId: string | null;
            journalEntryId: string | null;
            paymentVoucherId: string;
        })[];
        currency: string;
        exchangeRate: Prisma.Decimal;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        paymentRequestId: string | null;
        payeeType: import(".prisma/client").$Enums.PayeeType;
        payeeId: string | null;
        payeeName: string;
        paymentDate: Date;
        amount: Prisma.Decimal;
        baseAmount: Prisma.Decimal;
        reference: string | null;
    }>;
    createVoucher(dto: any, user: UserPayload): Promise<{
        currency: string;
        exchangeRate: Prisma.Decimal;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        paymentRequestId: string | null;
        payeeType: import(".prisma/client").$Enums.PayeeType;
        payeeId: string | null;
        payeeName: string;
        paymentDate: Date;
        amount: Prisma.Decimal;
        baseAmount: Prisma.Decimal;
        reference: string | null;
    }>;
    submitVoucher(id: string, user: UserPayload): Promise<{
        currency: string;
        exchangeRate: Prisma.Decimal;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        grantId: string;
        workflowInstanceId: string | null;
        paymentRequestId: string | null;
        payeeType: import(".prisma/client").$Enums.PayeeType;
        payeeId: string | null;
        payeeName: string;
        paymentDate: Date;
        amount: Prisma.Decimal;
        baseAmount: Prisma.Decimal;
        reference: string | null;
    }>;
    approveVoucher(id: string, comment: string | undefined, user: UserPayload): Promise<{
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
    markPaid(id: string, dto: any, user: UserPayload): Promise<{
        currency: string;
        exchangeRate: Prisma.Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
        paymentDate: Date;
        amount: Prisma.Decimal;
        baseAmount: Prisma.Decimal;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        bankAccountId: string | null;
        journalEntryId: string | null;
        paymentVoucherId: string;
    }>;
    findAllCheques(query: any): Promise<{
        data: ({
            bankAccount: {
                id: string;
                bankName: string;
                accountName: string;
            };
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ChequeStatus;
            serialNumber: string;
            issuedAt: Date | null;
            payeeName: string;
            amount: Prisma.Decimal;
            bankAccountId: string;
            fileUrl: string | null;
            chequeNumber: string;
            chequeDate: Date;
            memo: string | null;
            printedAt: Date | null;
            clearedAt: Date | null;
            paymentId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllTransfers(query: any): Promise<{
        data: ({
            fromBankAccount: {
                id: string;
                bankName: string;
                accountName: string;
            };
        } & {
            currency: string;
            exchangeRate: Prisma.Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BankTransferStatus;
            completedAt: Date | null;
            serialNumber: string;
            amount: Prisma.Decimal;
            baseAmount: Prisma.Decimal;
            reference: string | null;
            fileUrl: string | null;
            paymentId: string;
            toBankAccount: string;
            toBankName: string;
            toAccountName: string;
            transferDate: Date;
            swiftRef: string | null;
            fromBankAccountId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateChequeStatus(id: string, status: string, user: UserPayload): Promise<{
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ChequeStatus;
        serialNumber: string;
        issuedAt: Date | null;
        payeeName: string;
        amount: Prisma.Decimal;
        bankAccountId: string;
        fileUrl: string | null;
        chequeNumber: string;
        chequeDate: Date;
        memo: string | null;
        printedAt: Date | null;
        clearedAt: Date | null;
        paymentId: string;
    }>;
}
