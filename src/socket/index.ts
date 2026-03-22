import type { Server as HttpServer } from "node:http";

import { Server } from "socket.io";

import { initSocketEvents } from "./events.ts";
import { initSocketMiddlewares } from "./middlewares.ts";

let io: Server | null = null;

/**
 * Initializes Socket.IO on the given HTTP server: auth middleware, connection/disconnect handlers,
 * and status:change listener. Presence events are emitted only to accepted friends. Call once after creating the HTTP server.
 *
 * @param server - HTTP server (e.g. from express app)
 * @param corsOrigin - Allowed CORS origin for Socket.IO (e.g. same as REST API)
 */
export function initSocket(server: HttpServer, corsOrigin: string) {
  const socketServer = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  initSocketMiddlewares(socketServer);
  initSocketEvents(socketServer);

  io = socketServer;
}

/**
 * Returns the Socket.IO server instance. Use from REST handlers to emit to clients (e.g. friendship events).
 * Must be called after initSocket().
 */
export function getSocketIO(): Server {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initSocket() first.");
  }
  return io;
}
