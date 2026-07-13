import { apiClient } from './client';

export interface Project {
  id: string;
  code: string;
  name: string;
  grantId: string;
  grant?: { id: string; code: string; name: string; currency?: string };
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  committedBudget: number;
  spentBudget: number;
  availableBudget?: number;
  targetBeneficiaries?: number;
  progressPercent: number;
  description?: string;
  projectManagerId?: string;
  projectManager?: { id: string; firstName: string; lastName: string; email: string };
  milestones?: Milestone[];
  activities?: Activity[];
  _count?: { activities: number; milestones: number };
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate: string;
  status: string;
  budget: number;
  completedAt?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  code: string;
  projectId: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  plannedBudget: number;
  actualSpent?: number;
  progressPercent: number;
  responsibleUserId?: string;
  responsibleUser?: { id: string; firstName: string; lastName: string; email: string };
  description?: string;
  project?: {
    id: string;
    name: string;
    code: string;
    grant?: { id: string; code: string; name: string; currency: string };
  };
  createdAt: string;
}

export interface CreateProjectDto {
  code?: string;
  name: string;
  grantId: string;
  startDate: string;
  endDate: string;
  budget: number;
  targetBeneficiaries?: number;
  description?: string;
  projectManagerId?: string;
}

export interface CreateActivityDto {
  code?: string;
  name: string;
  projectId?: string;
  grantId?: string;
  startDate: string;
  endDate: string;
  plannedBudget: number;
  description?: string;
  responsibleUserId?: string;
}

export interface ActivitiesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  projectId?: string;
  grantId?: string;
}

export async function getProjects(query = {}) {
  const { data } = await apiClient.get('/projects', { params: query });
  return data.data;
}

export async function getProject(id: string): Promise<Project> {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data.data;
}

export async function createProject(dto: CreateProjectDto): Promise<Project> {
  const { data } = await apiClient.post('/projects', dto);
  return data.data;
}

export async function updateProject(id: string, dto: Partial<CreateProjectDto>): Promise<Project> {
  const { data } = await apiClient.patch(`/projects/${id}`, dto);
  return data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}

export async function createMilestone(projectId: string, dto: { title: string; dueDate: string; description?: string }) {
  const { data } = await apiClient.post(`/projects/${projectId}/milestones`, dto);
  return data.data;
}

export async function completeMilestone(projectId: string, milestoneId: string) {
  const { data } = await apiClient.post(`/projects/${projectId}/milestones/${milestoneId}/complete`);
  return data.data;
}

export async function getActivities(query: ActivitiesQuery = {}) {
  const { data } = await apiClient.get('/projects/activities', { params: query });
  return data.data;
}

export async function getActivity(id: string): Promise<Activity> {
  const { data } = await apiClient.get(`/projects/activities/${id}`);
  return data.data;
}

export async function createActivity(dto: CreateActivityDto) {
  const { data } = await apiClient.post('/projects/activities', {
    ...dto,
    plannedBudget: String(dto.plannedBudget),
  });
  return data.data;
}

export async function updateActivity(id: string, dto: Partial<CreateActivityDto>) {
  const payload = {
    ...dto,
    ...(dto.plannedBudget !== undefined && { plannedBudget: String(dto.plannedBudget) }),
  };
  const { data } = await apiClient.patch(`/projects/activities/${id}`, payload);
  return data.data;
}

export async function deleteActivity(id: string): Promise<void> {
  await apiClient.delete(`/projects/activities/${id}`);
}

export async function getBudgetAvailability(grantId: string, budgetLineId?: string) {
  const { data } = await apiClient.get('/projects/budget-availability', { params: { grantId, budgetLineId } });
  return data.data;
}
