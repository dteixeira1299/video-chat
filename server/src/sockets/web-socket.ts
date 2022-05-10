import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";

export interface SocketInterface {
  handleConnection(socket: Socket): void;
}

class WebSocket extends SocketServer {
  private static io: WebSocket;

  constructor(httpServer?: Server) {
    super(httpServer, {
      cors: {
        origin: "https://grupo2.ipmaia",
        methods: ["GET", "POST"],
      },
    });
  }

  public static getInstance(httpServer?: Server): WebSocket {
    if (!WebSocket.io) {
      WebSocket.io = new WebSocket(httpServer);
    }

    return WebSocket.io;
  }

  public initializeHandlers(socketHandlers: Array<SocketInterface>) {
    WebSocket.io.on("connection", (socket: Socket) => {
      socketHandlers.forEach((socketHandler) => {
        socketHandler.handleConnection(socket);
      });
    });
  }
}

export default WebSocket;
