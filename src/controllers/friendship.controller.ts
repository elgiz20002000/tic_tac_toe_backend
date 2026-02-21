import type { NextFunction, Request, Response } from "express";

import * as friendshipService from "../services/friendship.service.ts";

export const sendFriendshipRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { playerId } = req.body;
    const senderId = req.user!.id;

    await friendshipService.sendFriendshipRequestService(senderId, playerId);

    res.status(200).json({ message: "Friendship request sent successfully" });
  } catch (error) {
    next(error);
  }
};

export const acceptFriendshipRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requestId } = req.body;
    const userId = req.user!.id;

    await friendshipService.acceptFriendshipRequestService(requestId, userId);

    res.status(200).json({ message: "Friendship request accepted successfully" });
  } catch (error) {
    next(error);
  }
};

export const rejectFriendshipRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requestId } = req.body;
    const userId = req.user!.id;

    await friendshipService.rejectFriendshipRequestService(requestId, userId);

    res.status(200).json({ message: "Friendship request rejected successfully" });
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
