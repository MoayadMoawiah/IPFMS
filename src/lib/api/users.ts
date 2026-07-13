import { apiClient } from "./client";

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  arabicName?: string;
  phone?: string;
  departmentId?: string;
  organizationId?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  arabicName?: string;
  phone?: string;
  departmentId?: string | null;
  isActive?: boolean;
  roleIds?: string[];
}

export interface Role {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
}

export interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  arabicName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  department?: { id: string; name: string } | null;
  roles?: Role[];
}

export async function getUser(id: string): Promise<SystemUser> {
  const { data } = await apiClient.get(`/users/${id}`);
  return data.data;
}

export async function createUser(dto: CreateUserDto) {
  const { data } = await apiClient.post("/users", dto);
  return data.data;
}

export async function updateUser(id: string, dto: UpdateUserDto): Promise<SystemUser> {
  const { data } = await apiClient.patch(`/users/${id}`, dto);
  return data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

export async function getRoles(): Promise<Role[]> {
  const { data } = await apiClient.get("/roles");
  return data.data ?? data;
}
