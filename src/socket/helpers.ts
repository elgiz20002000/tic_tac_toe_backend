import { Socket } from "socket.io";

import * as friendshipService from "../services/friendship.service.ts";
import type { UserPresencePayload } from "./types.ts";

export const emitPresenceToFriends = async (
  event: string,
  data: UserPresencePayload,
  socket: Socket,
) => {
  const friendIds = await friendshipService.getAcceptedFriendUserIds(data.userId);

  for (const friendId of friendIds) {
    socket.to(friendId).emit(event, data);
  }
};
