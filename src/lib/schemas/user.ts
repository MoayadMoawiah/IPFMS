import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().optional(),
  arabicName: z.string().optional(),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  isActive: z.boolean(),
  roleIds: z.array(z.string()).min(1, 'At least one role is required'),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  arabicName: z.string().optional(),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  isActive: z.boolean(),
  roleIds: z.array(z.string()).min(1, 'At least one role is required'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
