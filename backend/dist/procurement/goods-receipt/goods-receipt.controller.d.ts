import { GoodsReceiptService } from './goods-receipt.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class GoodsReceiptController {
    private readonly svc;
    constructor(svc: GoodsReceiptService);
    findAll(q: any): Promise<{
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
    create(dto: any, user: UserPayload): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            grnId: string;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            poItemId: string;
            deliveredQuantity: import(".prisma/client/runtime/library").Decimal;
            acceptedQuantity: import(".prisma/client/runtime/library").Decimal;
            rejectedQuantity: import(".prisma/client/runtime/library").Decimal;
            damagedQuantity: import(".prisma/client/runtime/library").Decimal;
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
    findOne(id: string, user: UserPayload): Promise<{
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
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            grnId: string;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            poItemId: string;
            deliveredQuantity: import(".prisma/client/runtime/library").Decimal;
            acceptedQuantity: import(".prisma/client/runtime/library").Decimal;
            rejectedQuantity: import(".prisma/client/runtime/library").Decimal;
            damagedQuantity: import(".prisma/client/runtime/library").Decimal;
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
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
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
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            notes: string | null;
            grnId: string;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            poItemId: string;
            deliveredQuantity: import(".prisma/client/runtime/library").Decimal;
            acceptedQuantity: import(".prisma/client/runtime/library").Decimal;
            rejectedQuantity: import(".prisma/client/runtime/library").Decimal;
            damagedQuantity: import(".prisma/client/runtime/library").Decimal;
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
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
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
            subtotal: import(".prisma/client/runtime/library").Decimal;
            taxAmount: import(".prisma/client/runtime/library").Decimal;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            paidAmount: import(".prisma/client/runtime/library").Decimal;
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
    reject(id: string, body: {
        comment: string;
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
    return_(id: string, body: {
        comment: string;
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
