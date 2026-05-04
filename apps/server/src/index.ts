import http from "node:http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { registerSocketHandlers } from "./socket/handlers.js";

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "webdrop-signaling" });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.clientOrigin,
    methods: ["GET", "POST"]
  }
});

registerSocketHandlers(io);

httpServer.listen(env.port, () => {
  console.log(`WebDrop signaling server listening on http://localhost:${env.port}`);
});
