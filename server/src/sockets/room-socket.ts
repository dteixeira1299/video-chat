import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketInterface } from "./web-socket";

class RoomSocket implements SocketInterface {
  handleConnection(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): void {
    socket.on("room:join", (data: { roomId: string }) => {
      socket.join(data.roomId);
      socket.emit("room:joined");
    });
  }
}

export default RoomSocket;
