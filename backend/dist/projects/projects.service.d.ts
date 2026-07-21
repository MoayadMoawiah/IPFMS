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
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.ProjectStatus;
            grantId: string;
            targetBeneficiaries: number | null;
            budget: Prisma.Decimal;
            committedBudget: Prisma.Decimal;
            spentBudget: Prisma.Decimal;
            progressPercent: Prisma.Decimal;
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
            currency: string;
            id: string;
            name: string;
            code: string;
        };
        milestones: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.MilestoneStatus;
            completedAt: Date | null;
            title: string;
            dueDate: Date;
            approvedById: string | null;
            budget: Prisma.Decimal;
            projectId: string;
            quarter: import(".prisma/client").$Enums.Quarter;
            deliverables: Prisma.JsonValue | null;
            paymentPercent: Prisma.Decimal;
        }[];
        activities: ({
            budgetLines: ({
                budgetLine: {
                    currency: string;
                    id: string;
                    description: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    code: string;
                    createdById: string | null;
                    grantId: string;
                    activityId: string | null;
                    notes: string | null;
                    totalBudget: Prisma.Decimal;
                    committedAmount: Prisma.Decimal;
                    spentAmount: Prisma.Decimal;
                    category: import(".prisma/client").$Enums.BudgetCategory;
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
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.ActivityStatus;
            progressPercent: Prisma.Decimal;
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
            role: string;
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date | null;
            projectId: string;
        })[];
    } & {
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
        status: import(".prisma/client").$Enums.ProjectStatus;
        grantId: string;
        targetBeneficiaries: number | null;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        progressPercent: Prisma.Decimal;
        projectManagerId: string | null;
    }>;
    create(dto: any, user: UserPayload): Promise<{
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
        status: import(".prisma/client").$Enums.ProjectStatus;
        grantId: string;
        targetBeneficiaries: number | null;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        progressPercent: Prisma.Decimal;
        projectManagerId: string | null;
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
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
        status: import(".prisma/client").$Enums.ProjectStatus;
        grantId: string;
        targetBeneficiaries: number | null;
        budget: Prisma.Decimal;
        committedBudget: Prisma.Decimal;
        spentBudget: Prisma.Decimal;
        progressPercent: Prisma.Decimal;
        projectManagerId: string | null;
    }>;
    softDelete(id: string, user: UserPayload): Promise<void>;
    getMilestones(projectId: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        completedAt: Date | null;
        title: string;
        dueDate: Date;
        approvedById: string | null;
        budget: Prisma.Decimal;
        projectId: string;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
    }[]>;
    addMilestone(projectId: string, dto: any, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        completedAt: Date | null;
        title: string;
        dueDate: Date;
        approvedById: string | null;
        budget: Prisma.Decimal;
        projectId: string;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
    }>;
    completeMilestone(projectId: string, milestoneId: string, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        completedAt: Date | null;
        title: string;
        dueDate: Date;
        approvedById: string | null;
        budget: Prisma.Decimal;
        projectId: string;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: Prisma.JsonValue | null;
        paymentPercent: Prisma.Decimal;
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
                grant: {
                    currency: string;
                    id: string;
                    name: string;
                    code: string;
                };
                id: string;
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
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.ActivityStatus;
            progressPercent: Prisma.Decimal;
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
                currency: string;
                id: string;
                name: string;
                code: string;
                totalBudget: Prisma.Decimal;
            };
        } & {
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
            status: import(".prisma/client").$Enums.ProjectStatus;
            grantId: string;
            targetBeneficiaries: number | null;
            budget: Prisma.Decimal;
            committedBudget: Prisma.Decimal;
            spentBudget: Prisma.Decimal;
            progressPercent: Prisma.Decimal;
            projectManagerId: string | null;
        };
        budgetLines: ({
            budgetLine: {
                currency: string;
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                code: string;
                createdById: string | null;
                grantId: string;
                activityId: string | null;
                notes: string | null;
                totalBudget: Prisma.Decimal;
                committedAmount: Prisma.Decimal;
                spentAmount: Prisma.Decimal;
                category: import(".prisma/client").$Enums.BudgetCategory;
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
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        startDate: Date;
        endDate: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.ActivityStatus;
        progressPercent: Prisma.Decimal;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
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
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        startDate: Date;
        endDate: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.ActivityStatus;
        progressPercent: Prisma.Decimal;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
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
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        code: string;
        startDate: Date;
        endDate: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.ActivityStatus;
        progressPercent: Prisma.Decimal;
        projectId: string;
        plannedBudget: Prisma.Decimal;
        actualSpent: Prisma.Decimal;
        responsibleUserId: string | null;
    }>;
    softDeleteActivity(id: string, user: UserPayload): Promise<void>;
    updateProgress(id: string, progressPercent: number, user: UserPayload): Promise<{
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
        status: import(".prisma/client").$Enums.ActivityStatus;
        progressPercent: Prisma.Decimal;
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
        fileUrl: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteActivityDocument(activityId: string, attachmentId: string, user: UserPayload): Promise<void>;
}
