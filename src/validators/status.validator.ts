import { EOnlinePlayerStatus } from "@prisma/client";
import { z } from "zod";

export const changeStatusSchema = z.object({
  status: z.enum(Object.values(EOnlinePlayerStatus) as [string, ...string[]]),
});
