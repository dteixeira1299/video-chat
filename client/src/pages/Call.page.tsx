import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useEffect } from "react";
import styles from "../styles/Call.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, connect } from "socket.io-client";
import { createNewRTCPeerConnection } from "../utils/rtc-connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import {
  getUserStream,
  HTMLVideoElementWithCaptureStream
} from "../utils/devices";

export const CallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef<Socket>();
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const localVideoRef = useRef<HTMLVideoElementWithCaptureStream>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socketRef.current = connect(`https://10.0.0.206`);
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
        socketRef.current.emit("candidate:offer", { roomId, offer });
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

          const answer = await peerConnectionRef.current.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true
          });

          await peerConnectionRef.current.setLocalDescription(
            new RTCSessionDescription(answer)
          );

          socketRef.current.emit("candidate:answer", { roomId, answer });
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

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, []);

  const startUserMedia = async (): Promise<void> => {
    try {
      const stream = await getUserStream();
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      if (peerConnectionRef.current && socketRef.current) {
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

        stream.getTracks().forEach(track => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(track, stream);
          }
        });

        socketRef.current.emit("room:join", { roomId });
      }
    } catch (exception) {
      console.error(exception);
    }
  };

  const toogleAudioInputLocal = (): void => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach(sender => {
        if (sender.track) {
          if (sender.track.kind == "audioinput") {
            sender.track.enabled = !sender.track.enabled;
          }
        }
      });
    }
  };

  const toogleVideoLocal = (): void => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach(sender => {
        if (sender.track) {
          if (sender.track.kind == "videoinput") {
            sender.track.enabled = !sender.track.enabled;
          }
        }
      });
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
        <div>
          <button onClick={toogleAudioInputLocal} className="mt-4">
            <FontAwesomeIcon icon={solid("microphone")} className="fa-lg" />
          </button>
          <button onClick={toogleVideoLocal} className="mt-4">
            <FontAwesomeIcon icon={solid("camera")} className="fa-lg" />
          </button>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="mt-4"
          >
            <FontAwesomeIcon icon={solid("phone")} className="fa-lg" />
          </button>
        </div>
      </div>
      <video
        className={styles["localVideo"]}
        ref={localVideoRef}
        playsInline
        autoPlay
        muted
      ></video>
    </div>
  );
};
