import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class VendorInvoicesService {
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
            rating: Prisma.Decimal;
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
                orderedQuantity: Prisma.Decimal;
                receivedQuantity: Prisma.Decimal;
                unitPrice: Prisma.Decimal;
                totalPrice: Prisma.Decimal;
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
            subtotal: Prisma.Decimal;
            taxAmount: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
            paidAmount: Prisma.Decimal;
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
    softDelete(id: string, user: UserPayload): Promise<void>;
}
