import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MinioService } from '../uploads/minio.service';
import { Prisma } from '@prisma/client';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { CreateActivityDto, UpdateActivityDto } from './dto/create-activity.dto';
export declare class ProjectsService {
    private readonly prisma;
    private readonly auditSvc;
    private readonly minioSvc;
    constructor(prisma: PrismaService, auditSvc: AuditService, minioSvc: MinioService);
    findAll(query: any): Promise<{
        data: ({
            grant: {
                id: string;
                name: string;
                code: string;
            };
            _count: {
                milestones: number;
                activities: number;
            };
        } & {
            id: string;
            grantId: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            startDate: Date;
            endDate: Date;
            description: string | null;
            targetBeneficiaries: number | null;
            progressPercent: Prisma.Decimal;
            budget: Prisma.Decimal;
            committedBudget: Prisma.Decimal;
            spentBudget: Prisma.Decimal;
            projectManagerId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        grant: {
            id: string;
            currency: string;
            name: string;
            code: string;
        };
        milestones: {
            id: string;
            title: string;
            status: import(".prisma/client").$Enums.MilestoneStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            dueDate: Date;
            completedAt: Date | null;
            projectId: string;
            budget: Prisma.Decimal;
            quarter: import(".prisma/client").$Enums.Quarter;
            deliverables: Prisma.JsonValue | null;
            paymentPercent: Prisma.Decimal;
            approvedById: string | null;
        }[];
        activities: ({
            budgetLines: ({
                budgetLine: {
                    id: string;
                    grantId: string;
                    currency: string;
                    notes: string | null;
                    createdById: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    code: string;
                    totalBudget: Prisma.Decimal;
                    committedAmount: Prisma.Decimal;
                    spentAmount: Prisma.Decimal;
                    description: string;
                    activityId: string | null;
                    category: import(".prisma/client").$Enums.BudgetCategory;
                };
            } & {
                id: string;
                budgetLineId: string;
                createdAt: Date;
                updatedAt: Date;
                activityId: string;
                allocatedAmount: Prisma.Decimal;
            })[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ActivityStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            startDate: Date;
            endDate: Date;
            description: string | null;
            projectId: string;
            plannedBudget: Prisma.Decimal;
            actualSpent: Prisma.Decimal;
            progressPercent: Prisma.Decimal;
            responsibleUserId: string | null;
        })[];
        staff: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date | null;
            role: string;
            userId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        grantId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        code: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
        targetBeneficiaries: number | null;
        progressPercent: Prisma.Decimal;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        projectManagerId: string | null;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        id: string;
        grantId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        code: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
        targetBeneficiaries: number | null;
        progressPercent: Prisma.Decimal;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        projectManagerId: string | null;
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        grantId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        code: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
        targetBeneficiaries: number | null;
        progressPercent: Prisma.Decimal;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        projectManagerId: string | null;
    }>;
    softDelete(id: string, user: UserPayload): Promise<void>;
    getMilestones(projectId: string): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        dueDate: Date;
        completedAt: Date | null;
        projectId: string;
        budget: Prisma.Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
        approvedById: string | null;
    }[]>;
    addMilestone(projectId: string, dto: any, user: UserPayload): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        dueDate: Date;
        completedAt: Date | null;
        projectId: string;
        budget: Prisma.Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
        approvedById: string | null;
    }>;
    completeMilestone(projectId: string, milestoneId: string, user: UserPayload): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        dueDate: Date;
        completedAt: Date | null;
        projectId: string;
        budget: Prisma.Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
        approvedById: string | null;
    }>;
    private resolveProjectId;
    private getProjectWithGrant;
    private validateActivityDates;
    private validateActivityBudget;
    private generateActivityCode;
    private recalculateProjectProgress;
    findActivities(query: any): Promise<{
        data: ({
            project: {
                id: string;
                grant: {
                    id: string;
                    currency: string;
                    name: string;
                    code: string;
                };
                name: string;
                code: string;
            };
            responsibleUser: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ActivityStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            startDate: Date;
            endDate: Date;
            description: string | null;
            projectId: string;
            plannedBudget: Prisma.Decimal;
            actualSpent: Prisma.Decimal;
            progressPercent: Prisma.Decimal;
            responsibleUserId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findActivity(id: string): Promise<{
        budgetLines: ({
            budgetLine: {
                id: string;
                grantId: string;
                currency: string;
                notes: string | null;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                code: string;
                totalBudget: Prisma.Decimal;
                committedAmount: Prisma.Decimal;
                spentAmount: Prisma.Decimal;
                description: string;
                activityId: string | null;
                category: import(".prisma/client").$Enums.BudgetCategory;
            };
        } & {
            id: string;
            budgetLineId: string;
            createdAt: Date;
            updatedAt: Date;
            activityId: string;
            allocatedAmount: Prisma.Decimal;
        })[];
        project: {
            grant: {
                id: string;
                currency: string;
                name: string;
                code: string;
                totalBudget: Prisma.Decimal;
            };
        } & {
            id: string;
            grantId: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            startDate: Date;
            endDate: Date;
            description: string | null;
            targetBeneficiaries: number | null;
            progressPercent: Prisma.Decimal;
            budget: Prisma.Decimal;
            committedBudget: Prisma.Decimal;
            spentBudget: Prisma.Decimal;
            projectManagerId: string | null;
        };
        responsibleUser: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        code: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        progressPercent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    createActivity(dto: CreateActivityDto, user: UserPayload): Promise<{
        project: {
            id: string;
            name: string;
            code: string;
        };
        responsibleUser: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        code: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        progressPercent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    updateActivity(id: string, dto: UpdateActivityDto, user: UserPayload): Promise<{
        project: {
            id: string;
            name: string;
            code: string;
        };
        responsibleUser: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        code: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        progressPercent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    softDeleteActivity(id: string, user: UserPayload): Promise<void>;
    updateProgress(id: string, progressPercent: number, user: UserPayload): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        code: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        progressPercent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    uploadActivityDocuments(activityId: string, files: Express.Multer.File[], labels: string[], user: UserPayload): Promise<any[]>;
    listActivityDocuments(activityId: string): Promise<({
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
    deleteActivityDocument(activityId: string, attachmentId: string, user: UserPayload): Promise<void>;
}
