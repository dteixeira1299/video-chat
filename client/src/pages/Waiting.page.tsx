import React, { useEffect, useState, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col } from "react-bootstrap";
import { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import styles from "../styles/Call.module.css";
import { SelectComponent, SelectOption } from "../components/Select.component";
import { getUserDevices, getUserStream } from "../utils/devices";

interface HTMLCallElement extends HTMLVideoElement {
  setSinkId(id: string): void;
}

export const WaitingPage = () => {
  const [videoInput, setVideoInput] = useState<string>("");
  const [audioInput, setAudioInput] = useState<string>("");
  const [audioOutput, setAudioOutput] = useState<string>("");
  const [videoInputs, setVideoInputs] = useState<Array<any>>([]);
  const [audioInputs, setAudioInputs] = useState<Array<any>>([]);
  const [audioOutputs, setAudioOutputs] = useState<Array<any>>([]);
  const localVideoRef = useRef<HTMLCallElement>(null);
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = (): void => {
    getUserStream(videoInput, audioInput)
      .then(startUserMedia)
      .then(fillInputOptions)
      .catch((error: Error) => console.log(error));
  };

  const startUserMedia = (mediaStream: MediaStream): void => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
      streamRef.current = mediaStream;
    }
  };

  const updateCurrentVideoInput = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setVideoInput(event.target.value);
    loadMedia();
  };

  const updateCurrentAudioInput = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    if (streamRef.current)
      streamRef.current.getAudioTracks().forEach(track => track.stop());
    setAudioInput(event.target.value);
    loadMedia();
  };

  const updateCurrentAudioOutput = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    if (localVideoRef.current) {
      try {
        localVideoRef.current.setSinkId(event.target.value);
      } catch (error) {
        console.warn("Browser does not support output device selection.");
      }
    }
    setAudioOutput(event.target.value);
    loadMedia();
  };

  const toogleMicrophone = (): void => {
    if (streamRef.current) {
      streamRef.current
        .getAudioTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }
  };

  const toogleVideo = (): void => {
    if (streamRef.current) {
      streamRef.current
        .getVideoTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }
  };

  const fillInputOptions = async (): Promise<void> => {
    const devices = await getUserDevices();

    devices.forEach((deviceInfo: MediaDeviceInfo) => {
      const deviceOption = {
        value: deviceInfo.deviceId,
        label: deviceInfo.label
      };

      if (deviceInfo.kind === "videoinput") {
        setVideoInputs([...videoInputs, deviceOption]);
      }

      if (deviceInfo.kind === "audioinput") {
        setAudioInputs([...audioInputs, deviceOption]);
      }

      if (deviceInfo.kind === "audiooutput") {
        setAudioOutputs([...audioOutputs, deviceOption]);
      }
    });
  };

  return (
    <div>
      <h1 className={styles["title"]}>Choose your video and audio options</h1>

      <div className={styles["line"]}></div>

      <Container>
        <Row>
          <Col sm={8}>
            <video
              ref={localVideoRef}
              className={styles["video"]}
              playsInline
              autoPlay
            ></video>
            <div className={styles["bar-options"]}>
              <button className={styles["btn"]} onClick={toogleMicrophone}>
                <FontAwesomeIcon icon={solid("microphone")} />
              </button>
              <button className={styles["btn"]} onClick={toogleVideo}>
                <FontAwesomeIcon icon={solid("camera")} />
              </button>
            </div>
          </Col>
          <Col sm={4}>
            {videoInputs.length > 0 && (
              <SelectComponent
                label="Camera"
                className={styles["select-component"]}
                value={videoInput}
                options={videoInputs}
                onChange={updateCurrentVideoInput}
              ></SelectComponent>
            )}
            <SelectComponent
              label="Speaker"
              className={styles["select-component"]}
              value={audioOutput}
              options={audioOutputs}
              onChange={updateCurrentAudioOutput}
            ></SelectComponent>
            <SelectComponent
              label="Microphone"
              className={styles["select-component"]}
              value={audioInput}
              options={audioInputs}
              onChange={updateCurrentAudioInput}
            ></SelectComponent>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
