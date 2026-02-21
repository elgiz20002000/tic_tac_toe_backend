import { z } from "zod";

export const getGameHistorySchema = z.object({
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

export const getScoreboardSchema = z.object({
  searchText: z
    .string()
    .min(1, "Search text must be at least 1 character long")
    .max(50, "Search text must not exceed 50 characters")
    .optional(),
});
