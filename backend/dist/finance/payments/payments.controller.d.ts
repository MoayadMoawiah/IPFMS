import { PaymentsService } from './payments.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class PaymentsController {
    private readonly svc;
    constructor(svc: PaymentsService);
    findPaymentRequests(q: any): Promise<{
        data: ({
            paymentVouchers: {
                id: string;
                status: import(".prisma/client").$Enums.DocumentStatus;
                serialNumber: string;
            }[];
            grant: {
                id: string;
                name: string;
                code: string;
            };
            invoice: {
                id: string;
                status: import(".prisma/client").$Enums.InvoiceStatus;
                serialNumber: string;
                vendor: {
                    id: string;
                    name: string;
                };
                invoiceNumber: string;
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
            currency: string;
            workflowInstanceId: string | null;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            notes: string | null;
            invoiceId: string;
            requestDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            methodDetails: import(".prisma/client/runtime/library").JsonValue | null;
            bankAccountId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createPaymentRequest(dto: any, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: import(".prisma/client/runtime/library").Decimal;
        }[];
        grant: {
            id: string;
            name: string;
            code: string;
        };
        workflow: ({
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
                prId: string | null;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
        bankAccount: {
            id: string;
            accountName: string;
            bankName: string;
        } | null;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: import(".prisma/client/runtime/library").JsonValue | null;
        bankAccountId: string | null;
    }>;
    findOnePaymentRequest(id: string, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: import(".prisma/client/runtime/library").Decimal;
        }[];
        grant: {
            id: string;
            name: string;
            code: string;
        };
        workflow: ({
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
                prId: string | null;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
        bankAccount: {
            id: string;
            accountName: string;
            bankName: string;
        } | null;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: import(".prisma/client/runtime/library").JsonValue | null;
        bankAccountId: string | null;
    }>;
    updatePaymentRequest(id: string, dto: any, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: import(".prisma/client/runtime/library").Decimal;
        }[];
        grant: {
            id: string;
            name: string;
            code: string;
        };
        workflow: ({
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
                prId: string | null;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
        bankAccount: {
            id: string;
            accountName: string;
            bankName: string;
        } | null;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: import(".prisma/client/runtime/library").JsonValue | null;
        bankAccountId: string | null;
    }>;
    getCashReceipt(id: string): Promise<{
        title: string;
        organizationName: string;
        organizationShortName: string | null;
        requestSerial: string;
        requestDate: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
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
    uploadPaymentRequestDocuments(id: string, files: Express.Multer.File[], labelsJson: string, user: UserPayload): Promise<any[]>;
    listPaymentRequestDocuments(id: string): Promise<({
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
    listPaymentRequestSupportingDocuments(id: string): Promise<{
        id: string;
        documentType: string;
        documentId: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        fileUrl: string;
        storageKey: string;
        uploadedById: string;
        createdAt: Date;
        deletedAt: Date | null;
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        source: "pr" | "po" | "invoice" | "grn" | "payment_request" | "payment_voucher";
    }[]>;
    deletePaymentRequestDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
    submitPaymentRequest(id: string, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: import(".prisma/client/runtime/library").Decimal;
        }[];
        grant: {
            id: string;
            name: string;
            code: string;
        };
        workflow: ({
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
                prId: string | null;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
        bankAccount: {
            id: string;
            accountName: string;
            bankName: string;
        } | null;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: import(".prisma/client/runtime/library").JsonValue | null;
        bankAccountId: string | null;
    }>;
    approvePaymentRequest(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        hasSignedCashReceipt: boolean;
        paymentVouchers: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            amount: import(".prisma/client/runtime/library").Decimal;
        }[];
        grant: {
            id: string;
            name: string;
            code: string;
        };
        workflow: ({
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
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
        invoice: {
            vendor: {
                id: string;
                name: string;
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
            };
            po: {
                id: string;
                serialNumber: string;
                prId: string | null;
            };
            grn: {
                id: string;
                serialNumber: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            vendorId: string;
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
        bankAccount: {
            id: string;
            accountName: string;
            bankName: string;
        } | null;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        notes: string | null;
        invoiceId: string;
        requestDate: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        methodDetails: import(".prisma/client/runtime/library").JsonValue | null;
        bankAccountId: string | null;
    }>;
    findVouchers(q: any): Promise<{
        data: ({
            grant: {
                id: string;
                code: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            createdById: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            paymentRequestId: string | null;
            payeeType: import(".prisma/client").$Enums.PayeeType;
            payeeId: string | null;
            payeeName: string;
            paymentDate: Date;
            amount: import(".prisma/client/runtime/library").Decimal;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            baseAmount: import(".prisma/client/runtime/library").Decimal;
            reference: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createVoucher(dto: any, user: UserPayload): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        paymentRequestId: string | null;
        payeeType: import(".prisma/client").$Enums.PayeeType;
        payeeId: string | null;
        payeeName: string;
        paymentDate: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    findOneVoucher(id: string, user: UserPayload): Promise<{
        payments: {
            journalEntry: {
                id: string;
                status: import(".prisma/client").$Enums.JournalStatus;
                serialNumber: string;
                isPosted: boolean;
            } | null;
            cheques: {
                id: string;
                status: import(".prisma/client").$Enums.ChequeStatus;
                createdAt: Date;
                updatedAt: Date;
                serialNumber: string;
                currency: string;
                issuedAt: Date | null;
                payeeName: string;
                amount: import(".prisma/client/runtime/library").Decimal;
                bankAccountId: string;
                fileUrl: string | null;
                chequeNumber: string;
                chequeDate: Date;
                memo: string | null;
                paymentId: string;
                printedAt: Date | null;
                clearedAt: Date | null;
            }[];
            bankTransfers: {
                id: string;
                status: import(".prisma/client").$Enums.BankTransferStatus;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                serialNumber: string;
                currency: string;
                amount: import(".prisma/client/runtime/library").Decimal;
                exchangeRate: import(".prisma/client/runtime/library").Decimal;
                baseAmount: import(".prisma/client/runtime/library").Decimal;
                reference: string | null;
                fileUrl: string | null;
                paymentId: string;
                fromBankAccountId: string;
                toBankAccount: string;
                toBankName: string;
                toAccountName: string;
                transferDate: Date;
                swiftRef: string | null;
            }[];
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            currency: string;
            paymentDate: Date;
            amount: import(".prisma/client/runtime/library").Decimal;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            baseAmount: import(".prisma/client/runtime/library").Decimal;
            reference: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            bankAccountId: string | null;
            paymentVoucherId: string;
            journalEntryId: string | null;
        }[];
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
            id: string;
            name: string;
            code: string;
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
        paymentRequest: {
            id: string;
            serialNumber: string;
            currency: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            invoiceId: string;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            methodDetails: import(".prisma/client/runtime/library").JsonValue;
            bankAccountId: string | null;
            invoice: {
                id: string;
                serialNumber: string;
                vendor: {
                    id: string;
                    name: string;
                };
                po: {
                    id: string;
                    serialNumber: string;
                };
                invoiceNumber: string;
                grn: {
                    id: string;
                    serialNumber: string;
                } | null;
            };
            bankAccount: {
                id: string;
                accountName: string;
                bankName: string;
                accountNumber: string;
            } | null;
        } | null;
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        paymentRequestId: string | null;
        payeeType: import(".prisma/client").$Enums.PayeeType;
        payeeId: string | null;
        payeeName: string;
        paymentDate: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    listPaymentVoucherSupportingDocuments(id: string): Promise<{
        id: string;
        documentType: string;
        documentId: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        fileUrl: string;
        storageKey: string;
        uploadedById: string;
        createdAt: Date;
        deletedAt: Date | null;
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        source: "pr" | "po" | "invoice" | "grn" | "payment_request" | "payment_voucher";
    }[]>;
    listPaymentVoucherDocuments(id: string): Promise<({
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
    uploadPaymentVoucherDocuments(id: string, files: Express.Multer.File[], labelsJson: string, user: UserPayload): Promise<any[]>;
    deletePaymentVoucherDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
    submitVoucher(id: string, user: UserPayload): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        createdById: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        currency: string;
        workflowInstanceId: string | null;
        paymentRequestId: string | null;
        payeeType: import(".prisma/client").$Enums.PayeeType;
        payeeId: string | null;
        payeeName: string;
        paymentDate: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    approveVoucher(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
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
    markPaid(id: string, dto: any, user: UserPayload): Promise<{
        journalEntryId: string;
        journalEntry: {
            id: string;
            serialNumber: string;
            status: import(".prisma/client").$Enums.JournalStatus;
        };
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        currency: string;
        paymentDate: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        bankAccountId: string | null;
        paymentVoucherId: string;
    }>;
    findBankAccounts(): Promise<{
        id: string;
        currency: string;
        accountName: string;
        bankName: string;
        accountNumber: string;
        currentBalance: import(".prisma/client/runtime/library").Decimal;
    }[]>;
    findCheques(q: any): Promise<{
        data: ({
            bankAccount: {
                id: string;
                accountName: string;
                bankName: string;
                accountNumber: string;
            };
            payment: {
                id: string;
                paymentDate: Date;
                paymentVoucher: {
                    id: string;
                    status: import(".prisma/client").$Enums.DocumentStatus;
                    serialNumber: string;
                };
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ChequeStatus;
            createdAt: Date;
            updatedAt: Date;
            serialNumber: string;
            currency: string;
            issuedAt: Date | null;
            payeeName: string;
            amount: import(".prisma/client/runtime/library").Decimal;
            bankAccountId: string;
            fileUrl: string | null;
            chequeNumber: string;
            chequeDate: Date;
            memo: string | null;
            paymentId: string;
            printedAt: Date | null;
            clearedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateCheque(id: string, body: {
        status: string;
    }, user: UserPayload): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ChequeStatus;
        createdAt: Date;
        updatedAt: Date;
        serialNumber: string;
        currency: string;
        issuedAt: Date | null;
        payeeName: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        bankAccountId: string;
        fileUrl: string | null;
        chequeNumber: string;
        chequeDate: Date;
        memo: string | null;
        paymentId: string;
        printedAt: Date | null;
        clearedAt: Date | null;
    }>;
    findTransfers(q: any): Promise<{
        data: ({
            fromBankAccount: {
                id: string;
                accountName: string;
                bankName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.BankTransferStatus;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            serialNumber: string;
            currency: string;
            amount: import(".prisma/client/runtime/library").Decimal;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            baseAmount: import(".prisma/client/runtime/library").Decimal;
            reference: string | null;
            fileUrl: string | null;
            paymentId: string;
            fromBankAccountId: string;
            toBankAccount: string;
            toBankName: string;
            toAccountName: string;
            transferDate: Date;
            swiftRef: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
