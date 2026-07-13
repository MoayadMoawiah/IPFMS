import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getRoles,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/lib/api/users";

const USERS_KEY = "users";
const ROLES_KEY = "roles";

export function useRoles() {
  return useQuery({
    queryKey: [ROLES_KEY],
    queryFn: getRoles,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserDto) => createUser(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) => updateUser(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [USERS_KEY, id] });
      qc.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}
