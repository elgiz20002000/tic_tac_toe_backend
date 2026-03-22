/**
 * Socket event names used for real-time communication.
 * Clients should listen for these events and emit the corresponding "client" events where documented.
 */
export const SocketEvents = {
  /** Server → accepted friends only: a friend came online. Payload: { userId, name, status } */
  USER_ONLINE: "user:online",
  /** Server → accepted friends only: a friend went offline. Payload: { userId, name, status } */
  USER_OFFLINE: "user:offline",
  /** Server → accepted friends only: a friend's status changed. Payload: { userId, name, status } */
  USER_STATUS: "user:status",

  /** Client → server: set current status (Online | Playing | Offline). Payload: { status } */
  STATUS_CHANGE: "status:change",

  /** Server → client: new friendship request received. Payload: friendship + requester info */
  FRIENDSHIP_REQUEST: "friendship:request",
  /** Server → client: a friendship request was accepted. Payload: { requestId, addresseeId, addresseeName } */
  FRIENDSHIP_ACCEPTED: "friendship:accepted",
  /** Server → client: a friendship request was rejected. Payload: { requestId } */
  FRIENDSHIP_REJECTED: "friendship:rejected",
} as const;
