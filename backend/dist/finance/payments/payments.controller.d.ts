import { PaymentsService } from './payments.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class PaymentsController {
    private readonly svc;
    constructor(svc: PaymentsService);
    findVouchers(q: any): Promise<{
        data: ({
            grant: {
                id: string;
                code: string;
            };
        } & {
            currency: string;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
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
            amount: import(".prisma/client/runtime/library").Decimal;
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
        currency: string;
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
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
        amount: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    findOneVoucher(id: string): Promise<{
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
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            signedDate: Date | null;
            objectives: string | null;
            reportingRequirements: string | null;
            targetBeneficiaries: number | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
            coverageArea: string | null;
        };
        paymentRequest: ({
            invoice: {
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
                subtotal: import(".prisma/client/runtime/library").Decimal;
                taxAmount: import(".prisma/client/runtime/library").Decimal;
                totalAmount: import(".prisma/client/runtime/library").Decimal;
                paidAmount: import(".prisma/client/runtime/library").Decimal;
                notes: string | null;
                poId: string;
                dueDate: Date | null;
                fileUrl: string | null;
                invoiceNumber: string;
                invoiceDate: Date;
                isThreeWayMatched: boolean;
                matchedAt: Date | null;
                matchedById: string | null;
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
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            notes: string | null;
            invoiceId: string;
            requestDate: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
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
                amount: import(".prisma/client/runtime/library").Decimal;
                fileUrl: string | null;
                bankAccountId: string;
                chequeNumber: string;
                chequeDate: Date;
                memo: string | null;
                printedAt: Date | null;
                clearedAt: Date | null;
                paymentId: string;
            }[];
            bankTransfers: {
                currency: string;
                exchangeRate: import(".prisma/client/runtime/library").Decimal;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.BankTransferStatus;
                completedAt: Date | null;
                serialNumber: string;
                amount: import(".prisma/client/runtime/library").Decimal;
                baseAmount: import(".prisma/client/runtime/library").Decimal;
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
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.PaymentStatus;
            paymentDate: Date;
            amount: import(".prisma/client/runtime/library").Decimal;
            baseAmount: import(".prisma/client/runtime/library").Decimal;
            reference: string | null;
            journalEntryId: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            bankAccountId: string | null;
            paymentVoucherId: string;
        })[];
        currency: string;
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
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
        amount: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    submitVoucher(id: string, user: UserPayload): Promise<{
        currency: string;
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
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
        amount: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    approveVoucher(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
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
        exchangeRate: import(".prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
        paymentDate: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        baseAmount: import(".prisma/client/runtime/library").Decimal;
        reference: string | null;
        journalEntryId: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        bankAccountId: string | null;
        paymentVoucherId: string;
    }>;
    findCheques(q: any): Promise<{
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
            amount: import(".prisma/client/runtime/library").Decimal;
            fileUrl: string | null;
            bankAccountId: string;
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
    updateCheque(id: string, body: {
        status: string;
    }, user: UserPayload): Promise<{
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ChequeStatus;
        serialNumber: string;
        issuedAt: Date | null;
        payeeName: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        fileUrl: string | null;
        bankAccountId: string;
        chequeNumber: string;
        chequeDate: Date;
        memo: string | null;
        printedAt: Date | null;
        clearedAt: Date | null;
        paymentId: string;
    }>;
    findTransfers(q: any): Promise<{
        data: ({
            fromBankAccount: {
                id: string;
                bankName: string;
                accountName: string;
            };
        } & {
            currency: string;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BankTransferStatus;
            completedAt: Date | null;
            serialNumber: string;
            amount: import(".prisma/client/runtime/library").Decimal;
            baseAmount: import(".prisma/client/runtime/library").Decimal;
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
}
