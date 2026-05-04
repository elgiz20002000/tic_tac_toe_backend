import jwt from "jsonwebtoken";
import type { Server } from "socket.io";

import { prisma } from "../config/db/index.ts";

export const initSocketMiddlewares = (socketServer: Server) => {
  const jwtSecret = process.env.JWT_SECRET || "";

  socketServer.use(async (socket, next) => {
    const token = socket.handshake.auth?.token ?? socket.handshake.query.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as { id: string; name: string };
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true },
      });

      if (!dbUser) {
        return next(new Error("User not found"));
      }

      socket.data.userId = dbUser.id;
      socket.data.userName = dbUser.name;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });
};
