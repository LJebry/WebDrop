import { io, type Socket } from "socket.io-client";

export function createSocket(): Socket {
  return io(process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || "http://localhost:4000", {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 12,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
    timeout: 90000,
    transports: ["websocket", "polling"]
  });
}
