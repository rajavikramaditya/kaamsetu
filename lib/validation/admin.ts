import { z } from "zod";

export const adminWorkerActionSchema = z.object({
  rejection_reason: z.string().trim().max(500).optional(),
});

export const adminJobsQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export const adminWorkersQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});
