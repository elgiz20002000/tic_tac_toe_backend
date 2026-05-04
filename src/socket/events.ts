import { EOnlinePlayerStatus } from "@prisma/client";
import type { Server } from "socket.io";
import { upsertOnlinePlayerPresence } from "../utils/upsertOnlinePlayerPresence.ts";
import { SocketEvents } from "./constants.ts";
import { emitPresenceToFriends } from "./helpers.ts";
import type { UserPresencePayload } from "./types.ts";

export const initSocketEvents = (socketServer: Server) => {
  socketServer.on("connection", async (socket) => {
    const userId = socket.data.userId as string;
    const userName = socket.data.userName as string;

    socket.join(userId);

    await upsertOnlinePlayerPresence(userId, EOnlinePlayerStatus.Online);

    const payload: UserPresencePayload = {
      userId,
      name: userName,
      status: EOnlinePlayerStatus.Online,
    };

    await emitPresenceToFriends(SocketEvents.USER_ONLINE, payload, socket);

    socket.on(SocketEvents.STATUS_CHANGE, async (data: { status?: EOnlinePlayerStatus }) => {
      const status = data?.status;
      if (!status || !Object.values(EOnlinePlayerStatus).includes(status)) return;

      await upsertOnlinePlayerPresence(userId, status);
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
        await upsertOnlinePlayerPresence(userId, EOnlinePlayerStatus.Offline);
      } catch {
        // ignore persistence failures; still notify friends
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
