import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import React, { useRef, useEffect } from "react";
import styles from "../styles/Call.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, connect } from "socket.io-client";
import { createNewRTCPeerConnection } from "../utils/rtc-connection";
import {
  getUserStream,
  HTMLVideoElementWithCaptureStream,
  toogleAudioInput,
  toogleVideo
} from "../utils/devices";

export const CallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef<Socket>();
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const localVideoRef = useRef<HTMLVideoElementWithCaptureStream>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socketRef.current = connect(`${process.env.REACT_APP_API_URL}`);
    peerConnectionRef.current = createNewRTCPeerConnection();

    socketRef.current.on("room:joined", async () => {
      if (peerConnectionRef.current && socketRef.current) {
        const offer = await peerConnectionRef.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await peerConnectionRef.current.setLocalDescription(
          new RTCSessionDescription(offer)
        );
        socketRef.current.emit("candidate:offer", offer);
      }
    });

    socketRef.current.on(
      "candidate:joined",
      async (candidate: RTCIceCandidateInit) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      }
    );

    socketRef.current.on(
      "candidate:offer:made",
      async (offer: RTCSessionDescription) => {
        if (peerConnectionRef.current && socketRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );

          const localOffer = await peerConnectionRef.current.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true
          });

          await peerConnectionRef.current.setLocalDescription(
            new RTCSessionDescription(localOffer)
          );

          socketRef.current.emit("candidate:answer", localOffer);
        }
      }
    );

    socketRef.current.on(
      "candidate:answer:made",
      async (answer: RTCSessionDescription) => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      }
    );

    startUserMedia();

    if (socketRef.current) socketRef.current.disconnect();
    if (peerConnectionRef.current) peerConnectionRef.current.close();
  }, []);

  const startUserMedia = async (): Promise<void> => {
    try {
      const stream = await getUserStream();
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      if (peerConnectionRef.current && socketRef.current) {
        stream.getTracks().forEach(track => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(track, stream);
          }
        });

        peerConnectionRef.current.onicecandidate = (
          event: RTCPeerConnectionIceEvent
        ) => {
          if (event.candidate) {
            if (socketRef.current) {
              const candidate = event.candidate;
              socketRef.current.emit("candidate:new", { roomId, candidate });
            }
          }
        };

        peerConnectionRef.current.ontrack = (ev: RTCTrackEvent) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = ev.streams[0];
          }
        };

        socketRef.current.emit("room:join", { roomId });
      }
    } catch (exception) {
      console.error(exception);
    }
  };

  const toogleAudioInputLocal = (): void => {
    if (localVideoRef.current) {
      const stream = localVideoRef.current.captureStream();
      toogleAudioInput(stream);
    }
  };

  const toogleVideoLocal = (): void => {
    if (localVideoRef.current) {
      const stream = localVideoRef.current.captureStream();
      toogleVideo(stream);
    }
  };

  return (
    <div className={styles["main-container"]}>
      <div className={styles["video-container"]}>
        <video
          ref={remoteVideoRef}
          className={styles["video"]}
          playsInline
          autoPlay
        ></video>
      </div>
      <div>
        <Button
          onClick={toogleAudioInputLocal}
          variant="outline-primary"
          className="mt-4"
        >
          Disable Mic
        </Button>
        <Button onClick={toogleVideoLocal} variant="dark" className="mt-4">
          Disable Cam
        </Button>
        <Button
          onClick={() => {
            navigate("/");
          }}
          variant="dark"
          className="mt-4"
        >
          End Call
        </Button>
      </div>
    </div>
  );
};
