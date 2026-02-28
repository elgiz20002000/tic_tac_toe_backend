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
