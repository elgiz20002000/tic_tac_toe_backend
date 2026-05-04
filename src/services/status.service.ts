import type { EOnlinePlayerStatus } from "@prisma/client";

import { upsertOnlinePlayerPresence } from "../utils/upsertOnlinePlayerPresence.ts";

export const changeStatus = async (status: EOnlinePlayerStatus, userId: string): Promise<void> => {
  await upsertOnlinePlayerPresence(userId, status, { touchLastSeen: false });
};
