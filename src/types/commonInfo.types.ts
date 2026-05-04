import type { EInviteStatus, EOnlinePlayerStatus } from "@prisma/client";

/**
 * One online-presence row for `/commonInfo/online-players`, including friendship vs the viewer.
 */
export interface IOnlinePlayerListItem {
  readonly id: string;
  readonly userId: string;
  readonly lastSeen: Date;
  readonly currentStatus: EOnlinePlayerStatus;
  readonly user: {
    readonly id: string;
    readonly name: string;
  };
  /** `Friendship.status` when a row exists between viewer and this player; otherwise null */
  readonly inviteStatus: EInviteStatus | null;
  /** Who sent the invite relative to the viewer; null when no friendship row */
  readonly inviteDirection: "incoming" | "outgoing" | null;
}
