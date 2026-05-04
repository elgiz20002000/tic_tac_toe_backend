/**
 * Profiles for Prisma seeding. Names must stay unique (User.name is unique).
 * Use these emails when OAuth / dev login can map to seeded rows, or copy printed UUIDs after `npm run db:seed`.
 */
export const SEED_USER_MOBILE_TESTER = {
  name: "MobileTester",
  email: "mobile.tester@example.com",
  wins: 4,
  losses: 3,
  draws: 2,
} as const;

export const SEED_USER_FRIEND = {
  name: "SeedFriend",
  email: "seed.friend@example.com",
  wins: 2,
  losses: 5,
  draws: 1,
} as const;

/** Sends a pending invite to MobileTester (inbox / accept flow). */
export const SEED_USER_PENDING_TO_TESTER = {
  name: "SeedPendingToTester",
  email: "seed.pending.to.tester@example.com",
  wins: 1,
  losses: 1,
  draws: 0,
} as const;

/** No Friendship row with MobileTester — safe target for `send-friendship` from MobileTester. */
export const SEED_USER_INVITE_TARGET_A = {
  name: "SeedInviteTargetA",
  email: "seed.invite.a@example.com",
  wins: 0,
  losses: 0,
  draws: 0,
} as const;

export const SEED_USER_INVITE_TARGET_B = {
  name: "SeedInviteTargetB",
  email: "seed.invite.b@example.com",
  wins: 3,
  losses: 2,
  draws: 3,
} as const;

/**
 * Denied request toward MobileTester (shows in get-all-friendship-requests with Denied).
 * Note: backend blocks a new invite while this row exists.
 */
export const SEED_USER_DENIED_TO_TESTER = {
  name: "SeedDeniedToTester",
  email: "seed.denied.to.tester@example.com",
  wins: 0,
  losses: 2,
  draws: 0,
} as const;

/** Extra scoreboard / third-party graph (accepted + pending between non-tester users). */
export const SEED_USER_ALICE = {
  name: "Alice",
  email: "alice@example.com",
  wins: 10,
  losses: 4,
  draws: 1,
} as const;

export const SEED_USER_BOB = {
  name: "Bob",
  email: "bob@example.com",
  wins: 8,
  losses: 6,
  draws: 2,
} as const;

export const SEED_USER_CHARLIE = {
  name: "Charlie",
  email: "charlie@example.com",
  wins: 6,
  losses: 8,
  draws: 0,
} as const;
