import { EOnlinePlayerStatus, type User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { prisma } from "../config/db/index.ts";
import { upsertOnlinePlayerPresence } from "../utils/upsertOnlinePlayerPresence.ts";

export const loginCallback = async (user: User) => {
  let dbUser = await prisma.user.findUnique({
    where: { name: user.name },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        name: user.name,
      },
    });
  }

  await upsertOnlinePlayerPresence(dbUser.id, EOnlinePlayerStatus.Online);

  return jwt.sign({ id: dbUser.id, name: dbUser.name }, process.env.JWT_SECRET || "");
};
