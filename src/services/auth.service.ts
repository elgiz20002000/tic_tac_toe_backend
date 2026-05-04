import { EOnlinePlayerStatus, type User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { prisma } from "../config/db/index.ts";
import { createUserWithOnlinePlayer } from "../utils/createUserWithOnlinePlayer.ts";
import { upsertOnlinePlayerPresence } from "../utils/upsertOnlinePlayerPresence.ts";

export const loginCallback = async (user: User) => {
  const displayName = typeof user.name === "string" ? user.name.trim() : "";
  if (!displayName) {
    throw new Error("OAuth profile has no usable display name for User.name");
  }

  let dbUser = await prisma.user.findUnique({
    where: { name: displayName },
  });

  if (!dbUser) {
    const now = new Date();
    dbUser = await createUserWithOnlinePlayer(
      { name: displayName },
      { lastSeen: now, currentStatus: EOnlinePlayerStatus.Online },
    );
  } else {
    await upsertOnlinePlayerPresence(dbUser.id, EOnlinePlayerStatus.Online);
  }

  return jwt.sign({ id: dbUser.id, name: dbUser.name }, process.env.JWT_SECRET || "");
};
