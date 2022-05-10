import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketInterface } from "./web-socket";

class CandidateSocket implements SocketInterface {
  handleConnection(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): void {
    socket.on("candidate:new", (data: { roomId: string; candidate: any }) => {
      socket.broadcast.to(data.roomId).emit("candidate:joined", data.candidate);
    });

    socket.on("candidate:offer", (data: { roomId: string; offer: any }) => {
      socket.broadcast.to(data.roomId).emit("candidate:offer:made", data.offer);
    });

    socket.on("candidate:answer", (data: { roomId: string; answer: any }) => {
      socket.broadcast
        .to(data.roomId)
        .emit("candidate:answer:made", data.answer);
    });
  }
}

export default CandidateSocket;
