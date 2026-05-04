import { EOnlinePlayerStatus, type User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { prisma } from "../config/db/index.ts";
import { createUserWithOnlinePlayer } from "../utils/createUserWithOnlinePlayer.ts";
import { upsertOnlinePlayerPresence } from "../utils/upsertOnlinePlayerPresence.ts";

export const loginCallback = async (user: User) => {
  let dbUser = await prisma.user.findUnique({
    where: { name: user.name },
  });

  if (!dbUser) {
    const now = new Date();
    dbUser = await createUserWithOnlinePlayer(
      { name: user.name },
      { lastSeen: now, currentStatus: EOnlinePlayerStatus.Online },
    );
  } else {
    await upsertOnlinePlayerPresence(dbUser.id, EOnlinePlayerStatus.Online);
  }

  return jwt.sign({ id: dbUser.id, name: dbUser.name }, process.env.JWT_SECRET || "");
};
