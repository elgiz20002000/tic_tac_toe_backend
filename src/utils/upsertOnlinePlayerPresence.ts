import type { EOnlinePlayerStatus } from "@prisma/client";

import { prisma } from "../config/db/index.ts";

/**
 * Ensures an `OnlinePlayer` row exists for the user and applies presence fields.
 *
 * @param options.touchLastSeen - When false, only `currentStatus` is written on update (REST status-only updates).
 */
export const upsertOnlinePlayerPresence = async (
  userId: string,
  currentStatus: EOnlinePlayerStatus,
  options?: { readonly touchLastSeen?: boolean },
): Promise<void> => {
  const touchLastSeen = options?.touchLastSeen ?? true;
  const lastSeen = new Date();

  await prisma.onlinePlayer.upsert({
    where: { userId },
    create: {
      userId,
      lastSeen,
      currentStatus,
    },
    update: {
      ...(touchLastSeen ? { lastSeen } : {}),
      currentStatus,
    },
  });
};
