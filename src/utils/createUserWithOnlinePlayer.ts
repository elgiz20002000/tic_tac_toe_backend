import type { EOnlinePlayerStatus, Prisma } from "@prisma/client";

import { prisma } from "../config/db/index.ts";

/**
 * Creates a user together with their `OnlinePlayer` row in a single Prisma write.
 *
 * Any code path that inserts into `User` should use this helper so presence data always exists
 * immediately after signup or OAuth first-login user creation.
 */
export const createUserWithOnlinePlayer = async (
  userFields: Omit<Prisma.UserCreateInput, "onlinePlayer">,
  presence: {
    readonly lastSeen: Date;
    readonly currentStatus: EOnlinePlayerStatus;
  },
) =>
  prisma.user.create({
    data: {
      ...userFields,
      onlinePlayer: {
        create: {
          lastSeen: presence.lastSeen,
          currentStatus: presence.currentStatus,
        },
      },
    },
  });
