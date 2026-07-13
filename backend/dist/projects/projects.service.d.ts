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
                code: string;
                name: string;
            };
            _count: {
                milestones: number;
                activities: number;
            };
        } & {
            id: string;
            grantId: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            budget: Prisma.Decimal;
            committedBudget: Prisma.Decimal;
            spentBudget: Prisma.Decimal;
            targetBeneficiaries: number | null;
            progressPercent: Prisma.Decimal;
            status: import(".prisma/client").$Enums.ProjectStatus;
            projectManagerId: string | null;
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
    findOne(id: string): Promise<{
        grant: {
            id: string;
            code: string;
            name: string;
            currency: string;
        };
        milestones: {
            id: string;
            description: string | null;
            budget: Prisma.Decimal;
            status: import(".prisma/client").$Enums.MilestoneStatus;
            createdAt: Date;
            updatedAt: Date;
            quarter: import(".prisma/client").$Enums.Quarter;
            projectId: string;
            title: string;
            dueDate: Date;
            deliverables: Prisma.JsonValue | null;
            paymentPercent: Prisma.Decimal;
            completedAt: Date | null;
            approvedById: string | null;
        }[];
        activities: ({
            budgetLines: ({
                budgetLine: {
                    id: string;
                    grantId: string;
                    code: string;
                    description: string;
                    createdById: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    currency: string;
                    totalBudget: Prisma.Decimal;
                    committedAmount: Prisma.Decimal;
                    spentAmount: Prisma.Decimal;
                    activityId: string | null;
                    category: import(".prisma/client").$Enums.BudgetCategory;
                    notes: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                activityId: string;
                budgetLineId: string;
                allocatedAmount: Prisma.Decimal;
            })[];
        } & {
            id: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            progressPercent: Prisma.Decimal;
            status: import(".prisma/client").$Enums.ActivityStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            projectId: string;
            plannedBudget: Prisma.Decimal;
            actualSpent: Prisma.Decimal;
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
            startDate: Date;
            endDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
            projectId: string;
            userId: string;
            role: string;
        })[];
    } & {
        id: string;
        grantId: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        targetBeneficiaries: number | null;
        progressPercent: Prisma.Decimal;
        status: import(".prisma/client").$Enums.ProjectStatus;
        projectManagerId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        id: string;
        grantId: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        targetBeneficiaries: number | null;
        progressPercent: Prisma.Decimal;
        status: import(".prisma/client").$Enums.ProjectStatus;
        projectManagerId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        grantId: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        targetBeneficiaries: number | null;
        progressPercent: Prisma.Decimal;
        status: import(".prisma/client").$Enums.ProjectStatus;
        projectManagerId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    softDelete(id: string, user: UserPayload): Promise<void>;
    getMilestones(projectId: string): Promise<{
        id: string;
        description: string | null;
        budget: Prisma.Decimal;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        quarter: import(".prisma/client").$Enums.Quarter;
        projectId: string;
        title: string;
        dueDate: Date;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
        completedAt: Date | null;
        approvedById: string | null;
    }[]>;
    addMilestone(projectId: string, dto: any, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        budget: Prisma.Decimal;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        quarter: import(".prisma/client").$Enums.Quarter;
        projectId: string;
        title: string;
        dueDate: Date;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
        completedAt: Date | null;
        approvedById: string | null;
    }>;
    completeMilestone(projectId: string, milestoneId: string, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        budget: Prisma.Decimal;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        quarter: import(".prisma/client").$Enums.Quarter;
        projectId: string;
        title: string;
        dueDate: Date;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
        completedAt: Date | null;
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
                code: string;
                name: string;
                grant: {
                    id: string;
                    code: string;
                    name: string;
                    currency: string;
                };
            };
            responsibleUser: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            progressPercent: Prisma.Decimal;
            status: import(".prisma/client").$Enums.ActivityStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            projectId: string;
            plannedBudget: Prisma.Decimal;
            actualSpent: Prisma.Decimal;
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
        project: {
            grant: {
                id: string;
                code: string;
                name: string;
                currency: string;
                totalBudget: Prisma.Decimal;
            };
        } & {
            id: string;
            grantId: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            budget: Prisma.Decimal;
            committedBudget: Prisma.Decimal;
            spentBudget: Prisma.Decimal;
            targetBeneficiaries: number | null;
            progressPercent: Prisma.Decimal;
            status: import(".prisma/client").$Enums.ProjectStatus;
            projectManagerId: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        budgetLines: ({
            budgetLine: {
                id: string;
                grantId: string;
                code: string;
                description: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                currency: string;
                totalBudget: Prisma.Decimal;
                committedAmount: Prisma.Decimal;
                spentAmount: Prisma.Decimal;
                activityId: string | null;
                category: import(".prisma/client").$Enums.BudgetCategory;
                notes: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            activityId: string;
            budgetLineId: string;
            allocatedAmount: Prisma.Decimal;
        })[];
        responsibleUser: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        progressPercent: Prisma.Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    createActivity(dto: CreateActivityDto, user: UserPayload): Promise<{
        project: {
            id: string;
            code: string;
            name: string;
        };
        responsibleUser: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        progressPercent: Prisma.Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    updateActivity(id: string, dto: UpdateActivityDto, user: UserPayload): Promise<{
        project: {
            id: string;
            code: string;
            name: string;
        };
        responsibleUser: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        progressPercent: Prisma.Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    softDeleteActivity(id: string, user: UserPayload): Promise<void>;
    updateProgress(id: string, progressPercent: number, user: UserPayload): Promise<{
        id: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        progressPercent: Prisma.Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
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
        documentId: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        fileUrl: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteActivityDocument(activityId: string, attachmentId: string, user: UserPayload): Promise<void>;
}
