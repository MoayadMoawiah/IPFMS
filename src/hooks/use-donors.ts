import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDonors,
  getDonor,
  createDonor,
  updateDonor,
  deleteDonor,
  type DonorsQuery,
  type CreateDonorDto,
} from "@/lib/api/donors";

export const DONORS_KEY = "donors";

export function useDonors(query: DonorsQuery = {}) {
  return useQuery({
    queryKey: [DONORS_KEY, query],
    queryFn: () => getDonors(query),
  });
}

export function useDonor(id: string) {
  return useQuery({
    queryKey: [DONORS_KEY, id],
    queryFn: () => getDonor(id),
    enabled: !!id,
  });
}

export function useCreateDonor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDonorDto) => createDonor(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DONORS_KEY] }),
  });
}

export function useUpdateDonor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateDonorDto> }) =>
      updateDonor(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [DONORS_KEY, id] });
      qc.invalidateQueries({ queryKey: [DONORS_KEY] });
    },
  });
}

export function useDeleteDonor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDonor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DONORS_KEY] }),
  });
}
