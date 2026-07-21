import { PurchaseOrdersService } from './purchase-orders.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class PurchaseOrdersController {
    private readonly svc;
    constructor(svc: PurchaseOrdersService);
    findAll(q: any): Promise<{
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
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            receivedQuantity: import(".prisma/client/runtime/library").Decimal;
            unitPrice: import(".prisma/client/runtime/library").Decimal;
            totalPrice: import(".prisma/client/runtime/library").Decimal;
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
            rating: import(".prisma/client/runtime/library").Decimal;
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
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
        terms: string | null;
        notes: string | null;
        issuedById: string | null;
        issuedAt: Date | null;
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
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            receivedQuantity: import(".prisma/client/runtime/library").Decimal;
            unitPrice: import(".prisma/client/runtime/library").Decimal;
            totalPrice: import(".prisma/client/runtime/library").Decimal;
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
            rating: import(".prisma/client/runtime/library").Decimal;
        };
        invoices: {
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            currency: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
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
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
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
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
        terms: string | null;
        notes: string | null;
        issuedById: string | null;
        issuedAt: Date | null;
    }>;
    approve(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
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
    reject(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
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
    return_(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
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
        subtotal: import(".prisma/client/runtime/library").Decimal;
        taxAmount: import(".prisma/client/runtime/library").Decimal;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        paidAmount: import(".prisma/client/runtime/library").Decimal;
        terms: string | null;
        notes: string | null;
        issuedById: string | null;
        issuedAt: Date | null;
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
    deleteDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
    remove(id: string, user: UserPayload): Promise<void>;
}
