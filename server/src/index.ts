import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import DatabaseConnection from "./database-connection";
import callsRouter from "./controller/call.controller";
import WebSocket from "./sockets/web-socket";
import RoomSocket from "./sockets/room-socket";
import CandidateSocket from "./sockets/connection-socket";

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/calls", callsRouter);

httpServer.listen(port, async () => {
  await DatabaseConnection.initialize();
  const io = WebSocket.getInstance(httpServer);
  io.initializeHandlers([new RoomSocket(), new CandidateSocket()]);
  console.log(`Server listening on port: ${port}`);
});
