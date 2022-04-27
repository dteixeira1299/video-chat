import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { Component, createRef, RefObject, ChangeEvent, useState, useRef, useEffect } from "react";
import { SelectComponent, SelectOption } from "../components/Select.component";
import styles from "../styles/Call.module.css";
import { useNavigate } from "react-router-dom";

interface CallPageModel {
  stream?: MediaStream;
}

interface HTMLCallElement extends HTMLVideoElement {
  setSinkId(id: string): void;
}

export const CallPage = () => {

  const [stream, setStream] = useState<MediaStream>();
  const videoRef = useRef<any>();
  const navigate = useNavigate();
  
  useEffect(() => {
    getUserMedia()
    .then(startUserMedia)
    .catch((error: Error) => console.log(error));
  }, [])

  const toogleMicrophone = (): void => {
    if (stream) {
      stream
        .getAudioTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }
  };

  //TO DO - FAZER PEDIDO AO ENDPOINT PARA TERMINAR A CALL E TERMINAR CONEXÃO DE WEBSOCKETS
  const endCall = (): void => {
    navigate("/")
  };

  const toogleVideo = (): void => {
    if (stream) {
      stream
        .getVideoTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }
  };

  const startUserMedia = (mediaStream: MediaStream): void => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    }
  };

  const getUserDevices = (): Promise<MediaDeviceInfo[]> => {
    return navigator.mediaDevices.enumerateDevices();
  };

  const getUserMedia = async (): Promise<MediaStream> => {
    const hasVideo = (await getUserDevices()).filter(
      device => device.kind == "videoinput"
    );

    return navigator.mediaDevices.getUserMedia({
      video: hasVideo.length > 0,
      audio: true
    });
  };


  return (
    <div className={styles["main-container"]}>
    <div className={styles["video-container"]}>
      <video
        ref={videoRef}
        className={styles["video"]}
        playsInline
        autoPlay
      ></video>
    </div>
    <div>
    <Button 
        onClick={toogleMicrophone}
        variant="outline-primary"
        className="mt-4"
      >
        Disable Mic
      </Button>
      <Button
        onClick={toogleVideo}
        variant="dark"
        className="mt-4"
      >
        Disable Cam
      </Button>
      <Button
        onClick={endCall}
        variant="dark"
        className="mt-4"
      >
        End Call
      </Button>
    </div>
    </div>
  );
}
