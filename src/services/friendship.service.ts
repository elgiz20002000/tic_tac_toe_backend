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

  await prisma.friendship.create({
    data: {
      requesterId: senderId,
      addresseeId: playerId,
      status: EInviteStatus.Pending,
    },
  });
};

export const acceptFriendshipRequestService = async (
  requestId: string,
  userId: string,
): Promise<void> => {
  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
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

  await prisma.friendship.update({
    where: { id: requestId },
    data: { status: EInviteStatus.Accepted },
  });
};

export const rejectFriendshipRequestService = async (
  requestId: string,
  userId: string,
): Promise<void> => {
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

  await prisma.friendship.update({
    where: { id: requestId },
    data: { status: EInviteStatus.Denied },
  });
};

export const getAllUserFriendshipRequestsService = async (userId: string) => {
  if (!userId) {
    throw createResponseError("User ID is required", EResponseError.BadRequestError, 400);
  }

  // Incoming pending requests (user needs to accept/deny)
  const incoming = await prisma.friendship.findMany({
    where: {
      addresseeId: userId,
      status: EInviteStatus.Pending,
    },
    include: { requester: true },
  });

  // Outgoing pending requests (user sent, waiting for response)
  const outgoing = await prisma.friendship.findMany({
    where: {
      requesterId: userId,
      status: EInviteStatus.Pending,
    },
    include: { addressee: true },
  });

  // Denied requests (user is either requester or addressee)
  const denied = await prisma.friendship.findMany({
    where: {
      status: EInviteStatus.Denied,
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: { requester: true, addressee: true },
  });

  return {
    incoming,
    outgoing,
    denied,
  };
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
