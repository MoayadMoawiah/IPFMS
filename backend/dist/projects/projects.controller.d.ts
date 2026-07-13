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
            projectId: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.ActivityStatus;
            responsibleUserId: string | null;
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
        projectId: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        responsibleUserId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findActivity(id: string): Promise<{
        project: {
            grant: {
                id: string;
                code: string;
                name: string;
                currency: string;
                totalBudget: import(".prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.ProjectStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            grantId: string;
            budget: import(".prisma/client/runtime/library").Decimal;
            committedBudget: import(".prisma/client/runtime/library").Decimal;
            spentBudget: import(".prisma/client/runtime/library").Decimal;
            targetBeneficiaries: number | null;
            projectManagerId: string | null;
        };
        responsibleUser: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        budgetLines: ({
            budgetLine: {
                id: string;
                code: string;
                description: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                grantId: string;
                currency: string;
                totalBudget: import(".prisma/client/runtime/library").Decimal;
                committedAmount: import(".prisma/client/runtime/library").Decimal;
                spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            allocatedAmount: import(".prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        projectId: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        responsibleUserId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
        projectId: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        responsibleUserId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updateActivityProgress(id: string, dto: UpdateActivityProgressDto, user: UserPayload): Promise<{
        id: string;
        projectId: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ActivityStatus;
        responsibleUserId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
        documentId: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        fileUrl: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteActivityDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
    findAll(query: any): Promise<{
        data: ({
            _count: {
                milestones: number;
                activities: number;
            };
            grant: {
                id: string;
                code: string;
                name: string;
            };
        } & {
            id: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.ProjectStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            grantId: string;
            budget: import(".prisma/client/runtime/library").Decimal;
            committedBudget: import(".prisma/client/runtime/library").Decimal;
            spentBudget: import(".prisma/client/runtime/library").Decimal;
            targetBeneficiaries: number | null;
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
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ProjectStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        grantId: string;
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        targetBeneficiaries: number | null;
        projectManagerId: string | null;
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
            projectId: string;
            description: string | null;
            status: import(".prisma/client").$Enums.MilestoneStatus;
            createdAt: Date;
            updatedAt: Date;
            budget: import(".prisma/client/runtime/library").Decimal;
            quarter: import(".prisma/client").$Enums.Quarter;
            title: string;
            dueDate: Date;
            deliverables: import(".prisma/client/runtime/library").JsonValue | null;
            paymentPercent: import(".prisma/client/runtime/library").Decimal;
            completedAt: Date | null;
            approvedById: string | null;
        }[];
        activities: ({
            budgetLines: ({
                budgetLine: {
                    id: string;
                    code: string;
                    description: string;
                    createdById: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    grantId: string;
                    currency: string;
                    totalBudget: import(".prisma/client/runtime/library").Decimal;
                    committedAmount: import(".prisma/client/runtime/library").Decimal;
                    spentAmount: import(".prisma/client/runtime/library").Decimal;
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
                allocatedAmount: import(".prisma/client/runtime/library").Decimal;
            })[];
        } & {
            id: string;
            projectId: string;
            code: string;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.ActivityStatus;
            responsibleUserId: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        })[];
        staff: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            projectId: string;
            startDate: Date;
            endDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            role: string;
        })[];
    } & {
        id: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ProjectStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        grantId: string;
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        targetBeneficiaries: number | null;
        projectManagerId: string | null;
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        code: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.ProjectStatus;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        grantId: string;
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        targetBeneficiaries: number | null;
        projectManagerId: string | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
    getMilestones(id: string): Promise<{
        id: string;
        projectId: string;
        description: string | null;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        budget: import(".prisma/client/runtime/library").Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        title: string;
        dueDate: Date;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
        completedAt: Date | null;
        approvedById: string | null;
    }[]>;
    addMilestone(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        projectId: string;
        description: string | null;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        budget: import(".prisma/client/runtime/library").Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        title: string;
        dueDate: Date;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
        completedAt: Date | null;
        approvedById: string | null;
    }>;
    completeMilestone(id: string, mid: string, user: UserPayload): Promise<{
        id: string;
        projectId: string;
        description: string | null;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        createdAt: Date;
        updatedAt: Date;
        budget: import(".prisma/client/runtime/library").Decimal;
        quarter: import(".prisma/client").$Enums.Quarter;
        title: string;
        dueDate: Date;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
        completedAt: Date | null;
        approvedById: string | null;
    }>;
}
