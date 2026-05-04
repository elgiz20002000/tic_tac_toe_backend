import type { EOnlinePlayerStatus } from "@prisma/client";

import { prisma } from "../config/db/index.ts";

/**
 * Applies presence fields and guarantees an `OnlinePlayer` row exists (upsert).
 *
 * New accounts must not rely on this for initial creation — use {@link createUserWithOnlinePlayer}
 * whenever inserting a `User`. This helper is for updating presence on sockets, REST status changes,
 * returning OAuth users where legacy rows might lack `OnlinePlayer`, and similar cases.
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
