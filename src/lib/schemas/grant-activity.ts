import { z } from 'zod';

export const dateRangeRefine = (data: { startDate: string; endDate: string }) =>
  new Date(data.endDate) > new Date(data.startDate);

export const grantFormSchema = z
  .object({
    code: z.string().min(1, 'Grant code is required'),
    name: z.string().min(1, 'Grant name is required'),
    donorId: z.string().min(1, 'Please select a donor'),
    currency: z.string().min(1, 'Currency is required'),
    totalBudget: z
      .string()
      .min(1, 'Total budget is required')
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Must be a positive number'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    signedDate: z.string().optional(),
    description: z.string().optional(),
    objectives: z.string().optional(),
    conditions: z.string().optional(),
    reportingRequirements: z.string().optional(),
    targetBeneficiaries: z.string().optional(),
    grantManagerId: z.string().optional(),
  })
  .refine(dateRangeRefine, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const activityFormSchema = z
  .object({
    name: z.string().min(1, 'Activity name is required'),
    code: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    plannedBudget: z
      .string()
      .min(1, 'Planned budget is required')
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Must be a positive number'),
    description: z.string().optional(),
    responsibleUserId: z.string().optional(),
  })
  .refine(dateRangeRefine, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type GrantFormValues = z.infer<typeof grantFormSchema>;
export type ActivityFormValues = z.infer<typeof activityFormSchema>;
