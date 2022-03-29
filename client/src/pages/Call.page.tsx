import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col } from "react-bootstrap";
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

  async componentDidMount(): Promise<void> {
    try {
      await this.fillInputOptions();
      await this.startUserMedia();
    } catch (e) {
      console.error(e);
    }
  }

  private updateCurrentVideoInput = async (
    event: ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    this.setState({ videoInput: event.target.value });
    await this.startUserMedia();
  };

  private updateCurrentAudioInput = async (
    event: ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    this.setState({ audioInput: event.target.value });
    await this.startUserMedia();
  };

  private updateCurrentAudioOutput = async (
    event: ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    this.setState({ audioOutput: event.target.value });

    if (this.videoRef.current) {
      try {
        this.videoRef.current.setSinkId(event.target.value);
      } catch (error) {
        console.warn("Browser does not support output device selection.");
      }
    }
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

  private async startUserMedia(): Promise<void> {
    const mediaStream = await this.getUserMedia();

    if (this.videoRef.current) {
      this.setState({ stream: mediaStream });
      this.videoRef.current.srcObject = mediaStream;
    }
  }

  private async fillInputOptions(): Promise<void> {
    const devices = await this.getUserDevices();

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

    if (this.state.videoInputs.length) {
      this.setState(state => ({ videoInput: state.videoInputs[0].value }));
    }

    if (this.state.audioInputs.length) {
      this.setState(state => ({ audioInput: state.audioInputs[0].value }));
    }

    if (this.state.audioOutputs.length) {
      this.setState(state => ({ audioOutput: state.audioOutputs[0].value }));
    }
  }

  private async getUserDevices(): Promise<MediaDeviceInfo[]> {
    return await navigator.mediaDevices.enumerateDevices();
  }

  private async getUserMedia(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: this.state.videoInput
          ? { exact: this.state.videoInput }
          : undefined
      },
      audio: {
        deviceId: this.state.audioInput
          ? { exact: this.state.audioInput }
          : undefined
      }
    });
  }

  render(): JSX.Element {
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
                <button
                  className={styles["btn"]}
                  onClick={this.toogleMicrophone}
                >
                  <FontAwesomeIcon icon={solid("microphone")} />
                </button>
                <button
                  className={styles["btn"]}
                  onClick={this.toogleVideo}
                >
                  <FontAwesomeIcon icon={solid("camera")} />
                </button>
              </div>
            </Col>
            <Col sm={4}>
              <SelectComponent
                label="Camera"
                value={this.state.videoInput}
                options={this.state.videoInputs}
                onChange={this.updateCurrentVideoInput}
              ></SelectComponent>
              <br />
              <SelectComponent
                label="Speaker"
                value={this.state.audioOutput}
                options={this.state.audioOutputs}
                onChange={this.updateCurrentAudioOutput}
              ></SelectComponent>
              <br />
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
  }
}
