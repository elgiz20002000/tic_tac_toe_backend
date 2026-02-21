import { EGameStatus, EInviteStatus, EOnlinePlayerStatus } from "@prisma/client";

import { prisma } from "../config/db/index.ts";

async function main() {
  await prisma.scoreboard.deleteMany();
  await prisma.gameHistory.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.onlinePlayer.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({ data: { name: "Alice", email: "alice@example.com" } });
  const bob = await prisma.user.create({ data: { name: "Bob", email: "bob@example.com" } });
  const charlie = await prisma.user.create({
    data: { name: "Charlie", email: "charlie@example.com" },
  });

  await prisma.scoreboard.createMany({
    data: [
      { playerName: "Alice", score: 10 },
      { playerName: "Bob", score: 8 },
      { playerName: "Charlie", score: 6 },
    ],
  });

  await prisma.friendship.createMany({
    data: [
      { requesterId: alice.id, addresseeId: bob.id, status: EInviteStatus.Accepted },
      { requesterId: bob.id, addresseeId: charlie.id, status: EInviteStatus.Pending },
    ],
  });

  await prisma.onlinePlayer.create({
    data: { userId: alice.id, lastSeen: new Date(), currentStatus: EOnlinePlayerStatus.Online },
  });

  await prisma.gameHistory.create({
    data: {
      userId: alice.id,
      opponentName: "Bob",
      status: EGameStatus.Won,
      gameData: "Alice won against Bob",
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
