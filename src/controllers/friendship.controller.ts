import type { NextFunction, Request, Response } from "express";

import * as friendshipService from "../services/friendship.service.ts";
import { SocketEvents } from "../socket/constants.ts";
import { getSocketIO } from "../socket/index.ts";

export const sendFriendshipRequest = async (req: Request, res: Response, next: NextFunction) => {
  const socketIO = getSocketIO();
  try {
    const { playerId } = req.body;
    const senderId = req.user!.id;

    const friendship = await friendshipService.sendFriendshipRequestService(senderId, playerId);

    res.status(200).json({ message: "Friendship request sent successfully" });

    socketIO.to(playerId).emit(SocketEvents.FRIENDSHIP_REQUEST, friendship);
  } catch (error) {
    next(error);
  }
};

export const acceptFriendshipRequest = async (req: Request, res: Response, next: NextFunction) => {
  const socketIO = getSocketIO();
  try {
    const { requestId } = req.body;
    const userId = req.user!.id;

    const updatedFriendship = await friendshipService.acceptFriendshipRequestService(
      requestId,
      userId,
    );

    res.status(200).json({ message: "Friendship request accepted successfully" });

    socketIO.to(updatedFriendship.requesterId).emit(SocketEvents.FRIENDSHIP_ACCEPTED, {
      requestId: updatedFriendship.id,
      addresseeId: updatedFriendship.addresseeId,
      addresseeName: updatedFriendship.addressee.name,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectFriendshipRequest = async (req: Request, res: Response, next: NextFunction) => {
  const socketIO = getSocketIO();
  try {
    const { requestId } = req.body;
    const userId = req.user!.id;

    const updatedFriendship = await friendshipService.rejectFriendshipRequestService(
      requestId,
      userId,
    );

    res.status(200).json({ message: "Friendship request rejected successfully" });

    socketIO
      .to(updatedFriendship.requesterId)
      .emit(SocketEvents.FRIENDSHIP_REJECTED, { requestId });
  } catch (error) {
    next(error);
  }
};

export const getAllUserFriendshipRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const friendshipRequests = await friendshipService.getAllUserFriendshipRequestsService(userId);

    res.status(200).json(friendshipRequests);
  } catch (error) {
    next(error);
  }
};

export const getAllUserFriends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const friends = await friendshipService.getAllUserFriendsService(userId);

    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};
