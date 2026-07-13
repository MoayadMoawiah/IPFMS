import { apiClient } from "./client";

export type DonorType =
  | "BILATERAL"
  | "MULTILATERAL"
  | "PRIVATE"
  | "FOUNDATION"
  | "GOVERNMENT"
  | "OTHER";

export interface Donor {
  id: string;
  code: string;
  name: string;
  country?: string;
  donorType: DonorType;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { grants: number };
}

export interface CreateDonorDto {
  code: string;
  name: string;
  country?: string;
  donorType?: DonorType;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  notes?: string;
}

export interface DonorsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getDonors(query: DonorsQuery = {}): Promise<PaginatedResponse<Donor>> {
  const { data } = await apiClient.get<{ data: PaginatedResponse<Donor> }>("/donors", {
    params: query,
  });
  return data.data;
}

export async function getDonor(id: string): Promise<Donor> {
  const { data } = await apiClient.get<{ data: Donor }>(`/donors/${id}`);
  return data.data;
}

export async function createDonor(dto: CreateDonorDto): Promise<Donor> {
  const { data } = await apiClient.post<{ data: Donor }>("/donors", dto);
  return data.data;
}

export async function updateDonor(id: string, dto: Partial<CreateDonorDto>): Promise<Donor> {
  const { data } = await apiClient.patch<{ data: Donor }>(`/donors/${id}`, dto);
  return data.data;
}

export async function deleteDonor(id: string): Promise<void> {
  await apiClient.delete(`/donors/${id}`);
}
