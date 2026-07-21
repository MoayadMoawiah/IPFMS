import { ProjectsService } from './projects.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { CreateActivityDto, UpdateActivityDto, UpdateActivityProgressDto } from './dto/create-activity.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
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
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            projectId: string;
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
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
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        projectId: string;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        responsibleUserId: string | null;
    }>;
    findActivity(id: string): Promise<{
        project: {
            grant: {
                currency: string;
                id: string;
                name: string;
                code: string;
                totalBudget: import(".prisma/client/runtime/library").Decimal;
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
            budget: import(".prisma/client/runtime/library").Decimal;
            committedBudget: import(".prisma/client/runtime/library").Decimal;
            spentBudget: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
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
                totalBudget: import(".prisma/client/runtime/library").Decimal;
                committedAmount: import(".prisma/client/runtime/library").Decimal;
                spentAmount: import(".prisma/client/runtime/library").Decimal;
                category: import(".prisma/client").$Enums.BudgetCategory;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            activityId: string;
            budgetLineId: string;
            allocatedAmount: import(".prisma/client/runtime/library").Decimal;
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
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        projectId: string;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
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
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        projectId: string;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
        responsibleUserId: string | null;
    }>;
    updateActivityProgress(id: string, dto: UpdateActivityProgressDto, user: UserPayload): Promise<{
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
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        projectId: string;
        plannedBudget: import(".prisma/client/runtime/library").Decimal;
        actualSpent: import(".prisma/client/runtime/library").Decimal;
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
        documentId: string;
        fileUrl: string;
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
            budget: import(".prisma/client/runtime/library").Decimal;
            committedBudget: import(".prisma/client/runtime/library").Decimal;
            spentBudget: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
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
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        projectManagerId: string | null;
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
            budget: import(".prisma/client/runtime/library").Decimal;
            projectId: string;
            quarter: import(".prisma/client").$Enums.Quarter;
            deliverables: import(".prisma/client/runtime/library").JsonValue | null;
            paymentPercent: import(".prisma/client/runtime/library").Decimal;
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
                    totalBudget: import(".prisma/client/runtime/library").Decimal;
                    committedAmount: import(".prisma/client/runtime/library").Decimal;
                    spentAmount: import(".prisma/client/runtime/library").Decimal;
                    category: import(".prisma/client").$Enums.BudgetCategory;
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
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            projectId: string;
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
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
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
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
        budget: import(".prisma/client/runtime/library").Decimal;
        committedBudget: import(".prisma/client/runtime/library").Decimal;
        spentBudget: import(".prisma/client/runtime/library").Decimal;
        progressPercent: import(".prisma/client/runtime/library").Decimal;
        projectManagerId: string | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
    getMilestones(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        completedAt: Date | null;
        title: string;
        dueDate: Date;
        approvedById: string | null;
        budget: import(".prisma/client/runtime/library").Decimal;
        projectId: string;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
    }[]>;
    addMilestone(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        completedAt: Date | null;
        title: string;
        dueDate: Date;
        approvedById: string | null;
        budget: import(".prisma/client/runtime/library").Decimal;
        projectId: string;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
    }>;
    completeMilestone(id: string, mid: string, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        completedAt: Date | null;
        title: string;
        dueDate: Date;
        approvedById: string | null;
        budget: import(".prisma/client/runtime/library").Decimal;
        projectId: string;
        quarter: import(".prisma/client").$Enums.Quarter;
        deliverables: import(".prisma/client/runtime/library").JsonValue | null;
        paymentPercent: import(".prisma/client/runtime/library").Decimal;
    }>;
}
