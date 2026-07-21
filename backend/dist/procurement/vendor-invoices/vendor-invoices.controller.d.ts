import { VendorInvoicesService } from './vendor-invoices.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class VendorInvoicesController {
    private readonly svc;
    constructor(svc: VendorInvoicesService);
    findAll(q: any): Promise<{
        data: ({
            grant: {
                id: string;
                code: string;
            };
            vendor: {
                id: string;
                name: string;
            };
            po: {
                id: string;
                status: import(".prisma/client").$Enums.DocumentStatus;
                serialNumber: string;
                title: string;
            };
            grn: {
                id: string;
                status: import(".prisma/client").$Enums.DocumentStatus;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: any, user: UserPayload): Promise<{
        vendor: {
            id: string;
            name: string;
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
    }>;
    findOne(id: string, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
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
            rating: import(".prisma/client/runtime/library").Decimal;
        };
        po: {
            goodsReceipts: {
                id: string;
                status: import(".prisma/client").$Enums.DocumentStatus;
                serialNumber: string;
                receiptDate: Date;
            }[];
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                budgetLineId: string | null;
                poId: string;
                specification: string | null;
                unit: string;
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
            }[];
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
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
            terms: string | null;
            notes: string | null;
            issuedById: string | null;
            issuedAt: Date | null;
        };
        grn: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            receiptDate: Date;
        } | null;
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
    }>;
    submit(id: string, user: UserPayload): Promise<{
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
    }>;
    approve(id: string, body: {
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
    remove(id: string, user: UserPayload): Promise<void>;
}
