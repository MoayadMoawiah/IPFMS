export declare class CreateActivityDto {
    code?: string;
    name: string;
    projectId?: string;
    grantId?: string;
    startDate: string;
    endDate: string;
    plannedBudget: string;
    description?: string;
    responsibleUserId?: string;
}
export declare class UpdateActivityDto {
    name?: string;
    startDate?: string;
    endDate?: string;
    plannedBudget?: string;
    description?: string;
    responsibleUserId?: string;
    status?: string;
}
export declare class UpdateActivityProgressDto {
    progressPercent: number;
}
