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
                title: string;
                serialNumber: string;
            };
            receivedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
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
            description: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            deliveredQuantity: import(".prisma/client/runtime/library").Decimal;
            acceptedQuantity: import(".prisma/client/runtime/library").Decimal;
            rejectedQuantity: import(".prisma/client/runtime/library").Decimal;
            damagedQuantity: import(".prisma/client/runtime/library").Decimal;
            poItemId: string;
            grnId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
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
    findOne(id: string): Promise<{
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
        warehouse: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            deletedAt: Date | null;
            code: string;
            notes: string | null;
            address: string | null;
            managerId: string | null;
        } | null;
        items: ({
            poItem: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
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
            description: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            orderedQuantity: import(".prisma/client/runtime/library").Decimal;
            deliveredQuantity: import(".prisma/client/runtime/library").Decimal;
            acceptedQuantity: import(".prisma/client/runtime/library").Decimal;
            rejectedQuantity: import(".prisma/client/runtime/library").Decimal;
            damagedQuantity: import(".prisma/client/runtime/library").Decimal;
            poItemId: string;
            grnId: string;
        })[];
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
        po: {
            vendor: {
                id: string;
                name: string;
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
                orderedQuantity: import(".prisma/client/runtime/library").Decimal;
                receivedQuantity: import(".prisma/client/runtime/library").Decimal;
                unitPrice: import(".prisma/client/runtime/library").Decimal;
                totalPrice: import(".prisma/client/runtime/library").Decimal;
            }[];
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            grantId: string;
            budgetLineId: string | null;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
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
    remove(id: string, user: UserPayload): Promise<void>;
}
