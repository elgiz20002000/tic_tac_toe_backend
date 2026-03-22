import jwt from "jsonwebtoken";
import { Server } from "socket.io";

export const initSocketMiddlewares = (socketServer: Server) => {
  const jwtSecret = process.env.JWT_SECRET || "";

  socketServer.use((socket, next) => {
    const token = socket.handshake.auth?.token ?? socket.handshake.query.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as { id: string; name: string };
      socket.data.userId = decoded.id;
      socket.data.userName = decoded.name;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });
};
