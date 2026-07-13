import { apiClient } from './client';

export interface GrantProject {
  id: string;
  code: string;
  name: string;
  status: string;
  budget: number;
  progressPercent?: number;
  activities?: GrantActivity[];
  milestones?: GrantMilestone[];
  projectManager?: { id: string; firstName: string; lastName: string; email: string };
}

export interface GrantActivity {
  id: string;
  code: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  plannedBudget: number;
  actualSpent?: number;
  progressPercent: number;
  description?: string;
  responsibleUserId?: string;
  responsibleUser?: { id: string; firstName: string; lastName: string; email: string };
}

export interface GrantMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: string;
  budget: number;
}

export interface Grant {
  id: string;
  code: string;
  name: string;
  donorId: string;
  donor?: { id: string; code: string; name: string; shortName?: string };
  status: string;
  currency: string;
  totalBudget: number;
  committedAmount: number;
  spentAmount: number;
  availableAmount: number;
  utilizationPercent?: number;
  startDate: string;
  endDate: string;
  signedDate?: string;
  description?: string;
  objectives?: string;
  conditions?: string;
  targetBeneficiaries?: number;
  coverageArea?: string;
  reportingRequirements?: string;
  grantManagerId?: string;
  grantManager?: { id: string; firstName: string; lastName: string; email: string };
  projects?: GrantProject[];
  createdAt: string;
  updatedAt: string;
  budgetLines?: GrantBudgetLine[];
}

export interface GrantBudgetLine {
  id: string;
  code: string;
  description: string;
  totalBudget: number;
  committedAmount: number;
  spentAmount: number;
  currency: string;
  category?: string;
}

export interface GrantBudgetSummary {
  grant: { id: string; code: string; name: string; currency: string };
  summary: {
    totalBudget: number;
    totalCommitted: number;
    totalSpent: number;
    totalEncumbered: number;
    available: number;
    activityAllocated: number;
    activityUnallocated: number;
    utilizationPercent: number;
  };
  activities: GrantActivity[];
  budgetLines: GrantBudgetLine[];
}

export interface CreateGrantDto {
  code: string;
  name: string;
  donorId: string;
  currency: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  signedDate?: string;
  description?: string;
  objectives?: string;
  conditions?: string;
  targetBeneficiaries?: number;
  coverageArea?: string;
  reportingRequirements?: string;
  grantManagerId?: string;
}

export interface GrantsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  donorId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getGrants(query: GrantsQuery = {}): Promise<PaginatedResponse<Grant>> {
  const { data } = await apiClient.get<{ data: PaginatedResponse<Grant> }>('/grants', { params: query });
  return data.data;
}

export async function getGrant(id: string): Promise<Grant> {
  const { data } = await apiClient.get<{ data: Grant }>(`/grants/${id}`);
  return data.data;
}

export async function getGrantBudgetSummary(id: string): Promise<GrantBudgetSummary> {
  const { data } = await apiClient.get<{ data: GrantBudgetSummary }>(`/grants/${id}/budget`);
  return data.data;
}

export async function createGrant(dto: CreateGrantDto): Promise<Grant> {
  const { data } = await apiClient.post<{ data: Grant }>('/grants', {
    ...dto,
    totalBudget: String(dto.totalBudget),
  });
  return data.data;
}

export async function updateGrant(id: string, dto: Partial<CreateGrantDto>): Promise<Grant> {
  const payload = {
    ...dto,
    ...(dto.totalBudget !== undefined && { totalBudget: String(dto.totalBudget) }),
  };
  const { data } = await apiClient.patch<{ data: Grant }>(`/grants/${id}`, payload);
  return data.data;
}

export async function submitGrant(id: string): Promise<Grant> {
  const { data } = await apiClient.post<{ data: Grant }>(`/grants/${id}/submit`);
  return data.data;
}

export async function activateGrant(id: string): Promise<Grant> {
  const { data } = await apiClient.post<{ data: Grant }>(`/grants/${id}/activate`);
  return data.data;
}

export async function closeGrant(id: string, closureNotes: string): Promise<Grant> {
  const { data } = await apiClient.post<{ data: Grant }>(`/grants/${id}/close`, { closureNotes });
  return data.data;
}

export async function deleteGrant(id: string): Promise<void> {
  await apiClient.delete(`/grants/${id}`);
}

export { getDonors } from './donors';
