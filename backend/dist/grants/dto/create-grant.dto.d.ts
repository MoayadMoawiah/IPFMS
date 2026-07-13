export declare class CreateGrantDto {
    code: string;
    name: string;
    donorId: string;
    fiscalYearId?: string;
    currency: string;
    totalBudget: string;
    startDate: string;
    endDate: string;
    signedDate?: string;
    description?: string;
    objectives?: string;
    conditions?: string;
    reportingRequirements?: string;
    targetBeneficiaries?: number;
    grantManagerId?: string;
    projectCoordinatorId?: string;
}
