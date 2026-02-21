import { z } from "zod";

export const createFriendshipSchema = z.object({
  playerId: z.string().uuid(),
});

export const acceptFriendshipSchema = z.object({
  requestId: z.string().uuid(),
});

export const rejectFriendshipSchema = z.object({
  requestId: z.string().uuid(),
});
