import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/Call.module.css";
import { useNavigate } from "react-router-dom";
import {
  getUserStream,
  HTMLVideoElementWithCaptureStream,
  toogleAudioInput,
  toogleVideo
} from "../utils/devices";
import { Socket } from "socket.io-client";

export const CallPage = () => {
  const navigate = useNavigate();
  const socketRef = useRef<Socket>();
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const localVideoRef = useRef<HTMLVideoElementWithCaptureStream>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {}, []);

  //TO DO - FAZER PEDIDO AO ENDPOINT PARA TERMINAR A CALL E TERMINAR CONEXÃO DE WEBSOCKETS
  const endCall = (): void => {
    navigate("/");
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
        <Button onClick={endCall} variant="dark" className="mt-4">
          End Call
        </Button>
      </div>
    </div>
  );
};
