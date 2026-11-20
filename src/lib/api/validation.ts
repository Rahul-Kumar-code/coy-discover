import { z } from "zod";

export const swipeRequestSchema = z.object({
  profileId: z.string().trim().min(1, "profileId is required"),
  action: z.enum(["LIKE", "PASS"]),
});

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
