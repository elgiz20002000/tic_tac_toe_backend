import { EOnlinePlayerStatus } from "@prisma/client";

import { prisma } from "../config/db/index.ts";

export const changeStatus = async (status: EOnlinePlayerStatus, userId: string) => {
  return await prisma.onlinePlayer.update({
    where: { userId },
    data: { currentStatus: status },
  });
};
