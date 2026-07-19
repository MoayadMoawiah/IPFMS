import { ProjectsService } from './projects.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { CreateActivityDto, UpdateActivityDto, UpdateActivityProgressDto } from './dto/create-activity.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
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
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            responsibleUserId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
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
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        responsibleUserId: string | null;
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
                totalBudget: import(".prisma/client/runtime/library").Decimal;
                committedAmount: import(".prisma/client/runtime/library").Decimal;
                spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            allocatedAmount: import(".prisma/client/runtime/library").Decimal;
        })[];
        project: {
            grant: {
                id: string;
                currency: string;
                name: string;
                code: string;
                totalBudget: import(".prisma/client/runtime/library").Decimal;
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
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            budget: import(".prisma/client/runtime/library").Decimal;
            committedBudget: import(".prisma/client/runtime/library").Decimal;
            spentBudget: import(".prisma/client/runtime/library").Decimal;
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
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
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
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        responsibleUserId: string | null;
    }>;
    updateActivityProgress(id: string, dto: UpdateActivityProgressDto, user: UserPayload): Promise<{
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
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        responsibleUserId: string | null;
    }>;
    removeActivity(id: string, user: UserPayload): Promise<void>;
    uploadActivityDocuments(id: string, files: Express.Multer.File[], labelsJson: string, user: UserPayload): Promise<any[]>;
    listActivityDocuments(id: string): Promise<({
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
    deleteActivityDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
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
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            budget: import(".prisma/client/runtime/library").Decimal;
            committedBudget: import(".prisma/client/runtime/library").Decimal;
            spentBudget: import(".prisma/client/runtime/library").Decimal;
            projectManagerId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
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
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        projectManagerId: string | null;
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
            budget: import(".prisma/client/runtime/library").Decimal;
            quarter: import(".prisma/client").$Enums.Quarter;
            deliverables: import(".prisma/client/runtime/library").JsonValue | null;
            paymentPercent: import(".prisma/client/runtime/library").Decimal;
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
                    totalBudget: import(".prisma/client/runtime/library").Decimal;
                    committedAmount: import(".prisma/client/runtime/library").Decimal;
                    spentAmount: import(".prisma/client/runtime/library").Decimal;
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
                allocatedAmount: import(".prisma/client/runtime/library").Decimal;
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
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
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
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
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
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        projectManagerId: string | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
    getMilestones(id: string): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        dueDate: Date;
        completedAt: Date | null;
        projectId: string;
        budget: import(".prisma/client/runtime/library").Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
        approvedById: string | null;
    }[]>;
    addMilestone(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        dueDate: Date;
        completedAt: Date | null;
        projectId: string;
        budget: import(".prisma/client/runtime/library").Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
        approvedById: string | null;
    }>;
    completeMilestone(id: string, mid: string, user: UserPayload): Promise<{
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        dueDate: Date;
        completedAt: Date | null;
        projectId: string;
        budget: import(".prisma/client/runtime/library").Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
        approvedById: string | null;
    }>;
}
