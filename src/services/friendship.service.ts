import { EInviteStatus } from "@prisma/client";

import { prisma } from "../config/db/index.ts";
import { EResponseError } from "../enums.ts";
import { createResponseError } from "../utils/createResponseError.ts";

export const sendFriendshipRequestService = async (senderId: string, playerId: string) => {
  if (playerId === senderId) {
    throw createResponseError(
      "You cannot send a friend request to yourself",
      EResponseError.BadRequestError,
      400,
    );
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: senderId, addresseeId: playerId },
        { requesterId: playerId, addresseeId: senderId },
      ],
    },
  });

  if (existing) {
    throw createResponseError(
      "Friendship request already exists or you are already friends",
      EResponseError.ConflictError,
      409,
    );
  }

  const friendship = await prisma.friendship.create({
    data: {
      requesterId: senderId,
      addresseeId: playerId,
      status: EInviteStatus.Pending,
    },
  });

  return friendship;
};

export const acceptFriendshipRequestService = async (requestId: string, userId: string) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
    include: { addressee: true },
  });

  if (!friendship) {
    throw createResponseError("Friendship request not found", EResponseError.NotFoundError, 404);
  }

  if (friendship.addresseeId !== userId) {
    throw createResponseError(
      "You are not authorized to accept this request",
      EResponseError.ForbiddenError,
      403,
    );
  }

  const updatedFriendship = await prisma.friendship.update({
    where: { id: requestId },
    data: { status: EInviteStatus.Accepted },
    include: { addressee: true },
  });

  return updatedFriendship;
};

export const rejectFriendshipRequestService = async (requestId: string, userId: string) => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
  });

  if (!friendship) {
    throw createResponseError("Friendship request not found", EResponseError.NotFoundError, 404);
  }

  if (friendship.addresseeId !== userId) {
    throw createResponseError(
      "You are not authorized to reject this request",
      EResponseError.ForbiddenError,
      403,
    );
  }

  const updatedFriendship = await prisma.friendship.update({
    where: { id: requestId },
    data: { status: EInviteStatus.Denied },
    include: { requester: true },
  });

  return updatedFriendship;
};

export const getAllUserFriendshipRequestsService = async (userId: string) => {
  if (!userId) {
    throw createResponseError("User ID is required", EResponseError.BadRequestError, 400);
  }

  const invitationRequests = await prisma.friendship.findMany({
    where: {
      addresseeId: userId,
      status: { in: [EInviteStatus.Pending, EInviteStatus.Denied] },
    },
    include: { requester: true },
  });

  return invitationRequests;
};

export const getAcceptedFriendUserIds = async (userId: string): Promise<string[]> => {
  const rows = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: userId, status: EInviteStatus.Accepted },
        { addresseeId: userId, status: EInviteStatus.Accepted },
      ],
    },
    select: { requesterId: true, addresseeId: true },
  });

  return rows.map((row) => (row.requesterId === userId ? row.addresseeId : row.requesterId));
};

export const getAllUserFriendsService = async (userId: string) => {
  if (!userId) {
    throw createResponseError("User ID is required", EResponseError.BadRequestError, 400);
  }

  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: userId, status: EInviteStatus.Accepted },
        { addresseeId: userId, status: EInviteStatus.Accepted },
      ],
    },
    include: {
      requester: true,
      addressee: true,
    },
  });

  return friends;
};
