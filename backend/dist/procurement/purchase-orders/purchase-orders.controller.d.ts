import { PurchaseOrdersService } from './purchase-orders.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class PurchaseOrdersController {
    private readonly svc;
    constructor(svc: PurchaseOrdersService);
    findAll(q: any): Promise<{
        data: ({
            vendor: {
                id: string;
                name: string;
            };
            grant: {
                id: string;
                name: string;
                code: string;
            };
            _count: {
                items: number;
                goodsReceipts: number;
            };
        } & {
            id: string;
            serialNumber: string;
            prId: string | null;
            rfqId: string | null;
            pafId: string | null;
            vendorId: string;
            grantId: string;
            budgetLineId: string | null;
            contractId: string | null;
            title: string;
            deliveryAddress: string | null;
            deliveryDate: Date | null;
            currency: string;
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
            terms: string | null;
            notes: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            workflowInstanceId: string | null;
            issuedById: string | null;
            issuedAt: Date | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
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
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            registrationNumber: string;
            name: string;
            arabicName: string | null;
            vendorType: import(".prisma/client").$Enums.VendorType;
            country: string | null;
            address: string | null;
            city: string | null;
            phone: string | null;
            email: string | null;
            website: string | null;
            taxNumber: string | null;
            isBlacklisted: boolean;
            blacklistReason: string | null;
            blacklistDate: Date | null;
            rating: import(".prisma/client/runtime/library").Decimal;
        };
        grant: {
            id: string;
            currency: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            description: string | null;
            objectives: string | null;
            conditions: string | null;
            coverageArea: string | null;
            targetBeneficiaries: number | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
        items: {
            id: string;
            budgetLineId: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            specification: string | null;
            unit: string;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            receivedQuantity: import(".prisma/client/runtime/library").Decimal;
            unitPrice: import(".prisma/client/runtime/library").Decimal;
            totalPrice: import(".prisma/client/runtime/library").Decimal;
            poId: string;
        }[];
    } & {
        id: string;
        serialNumber: string;
        prId: string | null;
        rfqId: string | null;
        pafId: string | null;
        vendorId: string;
        grantId: string;
        budgetLineId: string | null;
        contractId: string | null;
        title: string;
        deliveryAddress: string | null;
        deliveryDate: Date | null;
        currency: string;
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
        terms: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        issuedById: string | null;
        issuedAt: Date | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findOne(id: string, user: UserPayload): Promise<{
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
            serialNumber: string;
            title: string;
            status: import(".prisma/client").$Enums.RfqStatus;
        } | null;
        paf: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            recommendedVendorId: string | null;
        } | null;
        vendor: {
            bankAccounts: {
                id: string;
                vendorId: string;
                currency: string;
                createdAt: Date;
                updatedAt: Date;
                country: string | null;
                isPrimary: boolean;
                bankName: string;
                accountName: string;
                accountNumber: string;
                iban: string | null;
                swiftCode: string | null;
            }[];
        } & {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            registrationNumber: string;
            name: string;
            arabicName: string | null;
            vendorType: import(".prisma/client").$Enums.VendorType;
            country: string | null;
            address: string | null;
            city: string | null;
            phone: string | null;
            email: string | null;
            website: string | null;
            taxNumber: string | null;
            isBlacklisted: boolean;
            blacklistReason: string | null;
            blacklistDate: Date | null;
            rating: import(".prisma/client/runtime/library").Decimal;
        };
        grant: {
            id: string;
            currency: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            description: string | null;
            objectives: string | null;
            conditions: string | null;
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
                    createdAt: Date;
                    documentType: string;
                    userId: string;
                    documentId: string;
                    action: string;
                    ipAddress: string;
                    userAgent: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                }) | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
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
                id: string;
                actionAt: Date;
                instanceId: string;
                action: import(".prisma/client").$Enums.WorkflowAction;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceStepId: string | null;
                actorId: string;
            })[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        }) | null;
        items: {
            id: string;
            budgetLineId: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            specification: string | null;
            unit: string;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            receivedQuantity: import(".prisma/client/runtime/library").Decimal;
            unitPrice: import(".prisma/client/runtime/library").Decimal;
            totalPrice: import(".prisma/client/runtime/library").Decimal;
            poId: string;
        }[];
        goodsReceipts: {
            id: string;
            serialNumber: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            receiptDate: Date;
        }[];
        invoices: {
            id: string;
            serialNumber: string;
            currency: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.InvoiceStatus;
        }[];
        id: string;
        serialNumber: string;
        prId: string | null;
        rfqId: string | null;
        pafId: string | null;
        vendorId: string;
        grantId: string;
        budgetLineId: string | null;
        contractId: string | null;
        title: string;
        deliveryAddress: string | null;
        deliveryDate: Date | null;
        currency: string;
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
        terms: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        issuedById: string | null;
        issuedAt: Date | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    submit(id: string, user: UserPayload): Promise<{
        id: string;
        serialNumber: string;
        prId: string | null;
        rfqId: string | null;
        pafId: string | null;
        vendorId: string;
        grantId: string;
        budgetLineId: string | null;
        contractId: string | null;
        title: string;
        deliveryAddress: string | null;
        deliveryDate: Date | null;
        currency: string;
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
        terms: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        issuedById: string | null;
        issuedAt: Date | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    approve(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
    }>;
    reject(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
    }>;
    return_(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
    }>;
    issue(id: string, user: UserPayload): Promise<{
        id: string;
        serialNumber: string;
        prId: string | null;
        rfqId: string | null;
        pafId: string | null;
        vendorId: string;
        grantId: string;
        budgetLineId: string | null;
        contractId: string | null;
        title: string;
        deliveryAddress: string | null;
        deliveryDate: Date | null;
        currency: string;
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
        terms: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        issuedById: string | null;
        issuedAt: Date | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    paymentStatus(id: string): Promise<{
        totalAmount: number;
        paidAmount: number;
        remainingAmount: number;
        paymentPercent: number;
    }>;
    uploadDocuments(id: string, files: Express.Multer.File[], labelsJson: string, user: UserPayload): Promise<any[]>;
    listDocuments(id: string): Promise<({
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
        fileUrl: string;
        documentId: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
    remove(id: string, user: UserPayload): Promise<void>;
}
