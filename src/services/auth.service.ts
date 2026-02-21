import { EOnlinePlayerStatus, type User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { prisma } from "../config/db/index.ts";

export const loginCallback = async (user: User) => {
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        name: user.name || null,
      },
    });

    await prisma.onlinePlayer.create({
      data: {
        userId: dbUser.id,
        lastSeen: new Date(),
      },
    });
  } else {
    await prisma.onlinePlayer.update({
      where: { userId: dbUser.id },
      data: {
        lastSeen: new Date(),
        currentStatus: EOnlinePlayerStatus.Online,
      },
    });
  }
  return jwt.sign({ id: dbUser.id, name: dbUser.name }, process.env.JWT_SECRET || "");
};
