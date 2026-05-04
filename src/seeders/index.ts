import { EGameStatus, EInviteStatus, EOnlinePlayerStatus } from "@prisma/client";

import { prisma } from "../config/db/index.ts";
import {
  SEED_USER_ALICE,
  SEED_USER_BOB,
  SEED_USER_CHARLIE,
  SEED_USER_DENIED_TO_TESTER,
  SEED_USER_FRIEND,
  SEED_USER_INVITE_TARGET_A,
  SEED_USER_INVITE_TARGET_B,
  SEED_USER_MOBILE_TESTER,
  SEED_USER_PENDING_TO_TESTER,
} from "../constants/seedData.ts";

async function main() {
  await prisma.scoreboard.deleteMany();
  await prisma.gameHistory.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.onlinePlayer.deleteMany();
  await prisma.user.deleteMany();

  const mobileTester = await prisma.user.create({ data: { ...SEED_USER_MOBILE_TESTER } });
  const seedFriend = await prisma.user.create({ data: { ...SEED_USER_FRIEND } });
  const pendingToTester = await prisma.user.create({ data: { ...SEED_USER_PENDING_TO_TESTER } });
  const inviteTargetA = await prisma.user.create({ data: { ...SEED_USER_INVITE_TARGET_A } });
  const inviteTargetB = await prisma.user.create({ data: { ...SEED_USER_INVITE_TARGET_B } });
  const deniedToTester = await prisma.user.create({ data: { ...SEED_USER_DENIED_TO_TESTER } });
  const alice = await prisma.user.create({ data: { ...SEED_USER_ALICE } });
  const bob = await prisma.user.create({ data: { ...SEED_USER_BOB } });
  const charlie = await prisma.user.create({ data: { ...SEED_USER_CHARLIE } });

  await prisma.friendship.createMany({
    data: [
      { requesterId: mobileTester.id, addresseeId: seedFriend.id, status: EInviteStatus.Accepted },
      {
        requesterId: pendingToTester.id,
        addresseeId: mobileTester.id,
        status: EInviteStatus.Pending,
      },
      {
        requesterId: deniedToTester.id,
        addresseeId: mobileTester.id,
        status: EInviteStatus.Denied,
      },
      { requesterId: alice.id, addresseeId: bob.id, status: EInviteStatus.Accepted },
      { requesterId: bob.id, addresseeId: charlie.id, status: EInviteStatus.Pending },
    ],
  });

  const now = new Date();
  /** Every seeded user needs an `OnlinePlayer` row — sockets and REST assume it exists. */
  await prisma.onlinePlayer.createMany({
    data: [
      { userId: mobileTester.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Online },
      { userId: seedFriend.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Online },
      { userId: pendingToTester.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Online },
      { userId: inviteTargetA.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Online },
      { userId: inviteTargetB.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Playing },
      { userId: deniedToTester.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Offline },
      { userId: alice.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Offline },
      { userId: bob.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Online },
      { userId: charlie.id, lastSeen: now, currentStatus: EOnlinePlayerStatus.Offline },
    ],
  });

  await prisma.scoreboard.createMany({
    data: [
      { playerName: SEED_USER_ALICE.name, score: 120 },
      { playerName: SEED_USER_BOB.name, score: 95 },
      { playerName: SEED_USER_MOBILE_TESTER.name, score: 88 },
      { playerName: SEED_USER_INVITE_TARGET_B.name, score: 72 },
      { playerName: SEED_USER_CHARLIE.name, score: 60 },
    ],
  });

  await prisma.gameHistory.createMany({
    data: [
      {
        userId: mobileTester.id,
        opponentId: seedFriend.id,
        opponentName: seedFriend.name,
        status: EGameStatus.Won,
        gameData: "MobileTester won vs SeedFriend",
      },
      {
        userId: mobileTester.id,
        opponentId: seedFriend.id,
        opponentName: seedFriend.name,
        status: EGameStatus.Draw,
        gameData: "draw",
      },
      {
        userId: alice.id,
        opponentId: bob.id,
        opponentName: bob.name,
        status: EGameStatus.Won,
        gameData: "Alice won vs Bob",
      },
    ],
  });

  const summary = {
    purpose: "Mobile / API QA — copy UUIDs into client or match OAuth email to User.email",
    mobileTester: {
      id: mobileTester.id,
      email: mobileTester.email,
      name: mobileTester.name,
      inviteThesePlayerIds: [inviteTargetA.id, inviteTargetB.id],
      note: "No Friendship row with invite targets — POST /send-friendship with playerId works. Denied/Pending senders already have a row (cannot invite them until backend allows it).",
    },
    incomingPendingRequest: {
      fromUserId: pendingToTester.id,
      fromName: pendingToTester.name,
    },
    acceptedFriend: { id: seedFriend.id, name: seedFriend.name },
    allUserIds: {
      mobileTester: mobileTester.id,
      seedFriend: seedFriend.id,
      pendingToTester: pendingToTester.id,
      inviteTargetA: inviteTargetA.id,
      inviteTargetB: inviteTargetB.id,
      deniedToTester: deniedToTester.id,
      alice: alice.id,
      bob: bob.id,
      charlie: charlie.id,
    },
  };

  console.log("Seeding complete!");
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
