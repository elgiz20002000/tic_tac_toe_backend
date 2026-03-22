import { EOnlinePlayerStatus } from "@prisma/client";
import { Server } from "socket.io";

import { prisma } from "../config/db/index.ts";
import { SocketEvents } from "./constants.ts";
import { emitPresenceToFriends } from "./helpers.ts";
import type { UserPresencePayload } from "./types.ts";

export const initSocketEvents = (socketServer: Server) => {
  socketServer.on("connection", async (socket) => {
    const userId = socket.data.userId as string;
    const userName = socket.data.userName as string;

    socket.join(userId);

    await prisma.onlinePlayer.update({
      where: { userId },
      data: {
        lastSeen: new Date(),
        currentStatus: EOnlinePlayerStatus.Online,
      },
    });

    const payload: UserPresencePayload = {
      userId,
      name: userName,
      status: EOnlinePlayerStatus.Online,
    };

    await emitPresenceToFriends(SocketEvents.USER_ONLINE, payload, socket);

    socket.on(SocketEvents.STATUS_CHANGE, async (data: { status?: EOnlinePlayerStatus }) => {
      const status = data?.status;
      if (!status || !Object.values(EOnlinePlayerStatus).includes(status)) return;

      await prisma.onlinePlayer.update({
        where: { userId },
        data: { currentStatus: status, lastSeen: new Date() },
      });
      await emitPresenceToFriends(
        SocketEvents.USER_STATUS,
        {
          userId,
          name: userName,
          status,
        },
        socket,
      );
    });

    socket.on("disconnect", async () => {
      try {
        await prisma.onlinePlayer.update({
          where: { userId },
          data: { currentStatus: EOnlinePlayerStatus.Offline, lastSeen: new Date() },
        });
      } catch {
        // ignore if user/row missing
      }
      const payload: UserPresencePayload = {
        userId,
        name: userName,
        status: EOnlinePlayerStatus.Offline,
      };

      await emitPresenceToFriends(SocketEvents.USER_OFFLINE, payload, socket);
    });
  });
};
