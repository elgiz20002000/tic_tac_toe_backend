import type { EInviteStatus } from "@prisma/client";

import { prisma } from "../config/db/index.ts";
import type { IOnlinePlayerListItem } from "../types/commonInfo.types.ts";

export const getMainPageInfo = async (userId: string) => {
  const playerCounts = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      losses: true,
      wins: true,
      draws: true,
      gameHistory: {
        take: 5,
      },
    },
  });

  const scoreboardData = await prisma.scoreboard.findMany({
    orderBy: { score: "desc" },
    take: 5,
  });

  const mainPageInfo = {
    ...playerCounts,
    scoreboardData,
  };

  return mainPageInfo;
};

export const getGameHistory = async (
  userId: string | undefined,
  dateFrom?: string,
  dateTo?: string,
) => {
  return prisma.gameHistory.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      userId,
      gameData: {
        gte: dateFrom || undefined,
        lte: dateTo || undefined,
      },
    },
  });
};

export const getScoreboard = async (searchText?: string) => {
  return prisma.scoreboard.findMany({
    orderBy: { score: "desc" },
    where: {
      playerName: { contains: searchText || undefined },
    },
  });
};

export const getOnlinePlayers = async (
  viewerUserId: string,
  searchText?: string,
): Promise<IOnlinePlayerListItem[]> => {
  const where = {
    userId: { not: viewerUserId },
    ...(searchText?.trim()
      ? {
          user: {
            name: { contains: searchText.trim(), mode: "insensitive" as const },
          },
        }
      : {}),
  };

  const rows = await prisma.onlinePlayer.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          receivedFriendRequests: {
            where: { requesterId: viewerUserId },
            select: { status: true },
            take: 1,
          },
          sentFriendRequests: {
            where: { addresseeId: viewerUserId },
            select: { status: true },
            take: 1,
          },
        },
      },
    },
    orderBy: { lastSeen: "desc" },
  });

  return rows.map((row): IOnlinePlayerListItem => {
    const outgoing = row.user.receivedFriendRequests[0];
    const incoming = row.user.sentFriendRequests[0];

    let inviteStatus: EInviteStatus | null = null;
    let inviteDirection: "incoming" | "outgoing" | null = null;

    if (outgoing) {
      inviteStatus = outgoing.status;
      inviteDirection = "outgoing";
    } else if (incoming) {
      inviteStatus = incoming.status;
      inviteDirection = "incoming";
    }

    return {
      id: row.id,
      userId: row.userId,
      lastSeen: row.lastSeen,
      currentStatus: row.currentStatus,
      user: {
        id: row.user.id,
        name: row.user.name,
      },
      inviteStatus,
      inviteDirection,
    };
  });
};
