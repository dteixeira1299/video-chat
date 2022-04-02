import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { Component, createRef, RefObject, ChangeEvent } from "react";
import { SelectComponent, SelectOption } from "../components/Select.component";
import styles from "../styles/Call.module.css";

interface CallPageModel {
  videoInput?: string;
  audioInput?: string;
  audioOutput?: string;
  videoInputs: SelectOption[];
  audioInputs: SelectOption[];
  audioOutputs: SelectOption[];
  stream?: MediaStream;
}

interface HTMLCallElement extends HTMLVideoElement {
  setSinkId(id: string): void;
}

export class CallPage extends Component<{}, CallPageModel> {
  private videoRef: RefObject<HTMLCallElement>;

  constructor(props: {}) {
    super(props);
    this.state = { videoInputs: [], audioInputs: [], audioOutputs: [] };
    this.videoRef = createRef();
  }

  componentDidMount = (): void => {
    this.getUserMedia()
      .then(this.startUserMedia)
      .then(this.fillInputOptions)
      .catch((error: Error) => console.log(error));
  };

  private loadMedia = (): void => {
    this.getUserMedia()
      .then(this.startUserMedia)
      .then(this.fillInputOptions)
      .catch((error: Error) => console.log(error));
  };

  private updateCurrentVideoInput = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    this.setState({ videoInput: event.target.value }, this.loadMedia);
  };

  private updateCurrentAudioInput = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    if (this.state.stream)
      this.state.stream.getAudioTracks().forEach(track => track.stop());
    this.setState({ audioInput: event.target.value }, this.loadMedia);
  };

  private updateCurrentAudioOutput = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    if (this.videoRef.current) {
      try {
        this.videoRef.current.setSinkId(event.target.value);
      } catch (error) {
        console.warn("Browser does not support output device selection.");
      }
    }
    this.setState({ audioOutput: event.target.value }, this.loadMedia);
  };

  private toogleMicrophone = (): void => {
    if (this.state.stream) {
      this.state.stream
        .getAudioTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }
  };
  private toogleVideo = (): void => {
    if (this.state.stream) {
      this.state.stream
        .getVideoTracks()
        .forEach(track => (track.enabled = !track.enabled));
    }
  };

  private startUserMedia = (mediaStream: MediaStream): void => {
    if (this.videoRef.current) {
      this.videoRef.current.srcObject = mediaStream;
      this.setState({ stream: mediaStream });
    }
  };

  private fillInputOptions = async (): Promise<void> => {
    const devices = await this.getUserDevices();
    this.setState(state => ({
      videoInputs: [],
      audioInputs: [],
      audioOutputs: []
    }));

    devices.forEach((deviceInfo: MediaDeviceInfo) => {
      const deviceOption = {
        value: deviceInfo.deviceId,
        label: deviceInfo.label
      };

      if (deviceInfo.kind === "videoinput") {
        this.setState(state => ({
          videoInputs: [...state.videoInputs, deviceOption]
        }));
      }

      if (deviceInfo.kind === "audioinput") {
        this.setState(state => ({
          audioInputs: [...state.audioInputs, deviceOption]
        }));
      }

      if (deviceInfo.kind === "audiooutput") {
        this.setState(state => ({
          audioOutputs: [...state.audioOutputs, deviceOption]
        }));
      }
    });
  };

  private getUserDevices = (): Promise<MediaDeviceInfo[]> => {
    return navigator.mediaDevices.enumerateDevices();
  };

  private getUserMedia = async (): Promise<MediaStream> => {
    const hasVideo = (await this.getUserDevices()).filter(
      device => device.kind == "videoinput"
    );
    const videoConstraint = this.state.videoInput
      ? { deviceId: { exact: this.state.videoInput } }
      : hasVideo.length > 0;

    const audioConstraint = this.state.audioInput
      ? { deviceId: { exact: this.state.audioInput } }
      : true;

    return navigator.mediaDevices.getUserMedia({
      video: videoConstraint,
      audio: audioConstraint
    });
  };

  render = (): JSX.Element => {
    return (
      <div>
        <h1 className={styles["title"]}>Choose your video and audio options</h1>

        <div className={styles["line"]}></div>

        <Container>
          <Row>
            <Col sm={8}>
              <video
                ref={this.videoRef}
                className={styles["video"]}
                playsInline
                autoPlay
              ></video>
              <div className={styles["bar-options"]}>
                <Button onClick={this.toogleMicrophone} variant="dark">
                  <FontAwesomeIcon icon={solid("microphone")} />
                </Button>
                <Button
                  onClick={this.toogleVideo}
                  variant="dark"
                  className="ms-2"
                >
                  <FontAwesomeIcon icon={solid("camera")} />
                </Button>
              </div>
            </Col>
            <Col sm={4}>
              {this.state.videoInputs.length > 0 && (
                <SelectComponent
                  label="Camera"
                  className="mb-4"
                  value={this.state.videoInput}
                  options={this.state.videoInputs}
                  onChange={this.updateCurrentVideoInput}
                ></SelectComponent>
              )}
              <SelectComponent
                label="Speaker"
                className="mb-4"
                value={this.state.audioOutput}
                options={this.state.audioOutputs}
                onChange={this.updateCurrentAudioOutput}
              ></SelectComponent>
              <SelectComponent
                label="Microphone"
                value={this.state.audioInput}
                options={this.state.audioInputs}
                onChange={this.updateCurrentAudioInput}
              ></SelectComponent>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };
}
