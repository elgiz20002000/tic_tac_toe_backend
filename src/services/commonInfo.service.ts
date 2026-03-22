import { prisma } from "../config/db/index.ts";

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

export const getOnlinePlayers = async (excludeUserId: string, searchText?: string) => {
  const where = {
    userId: { not: excludeUserId },
    ...(searchText?.trim()
      ? {
          user: {
            name: { contains: searchText.trim(), mode: "insensitive" as const },
          },
        }
      : {}),
  };

  return prisma.onlinePlayer.findMany({
    where,
    include: { user: { select: { id: true, name: true } } },
    orderBy: { lastSeen: "desc" },
  });
};
