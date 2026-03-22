import { EOnlinePlayerStatus } from "@prisma/client";

/**
 * Payload sent to clients when a user comes online or status changes.
 */
export interface UserPresencePayload {
  userId: string;
  name: string;
  status: EOnlinePlayerStatus;
}
