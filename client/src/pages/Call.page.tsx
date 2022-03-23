import React, { Component, createRef, RefObject, ChangeEvent } from "react";
import { SelectComponent, SelectOption } from "../components/Select.component";
import styles from "../styles/Call.module.css";
import song from "../sounds/testCall.mp3";

interface CallPageModel {
  videoInput?: string;
  audioInput?: string;
  audioOutput?: string;
  videoInputs: SelectOption[];
  audioInputs: SelectOption[];
  audioOutputs: SelectOption[];
  audio?: any;
  isPlaying?: any;
}

export class CallPage extends Component<{}, CallPageModel> {
  private videoRef: RefObject<HTMLVideoElement>;

  constructor(props: {}) {
    super(props);
    this.state = { videoInputs: [], audioInputs: [], audioOutputs: [], audio: new Audio(song), isPlaying: false, };
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
    await this.startUserMedia();
  };

  private async startUserMedia(): Promise<void> {
    const mediaStream = await this.getUserMedia();

    if (this.videoRef.current) {
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

  playPause = () => {

    let isPlaying = this.state.isPlaying;

    if (isPlaying) {
      this.state.audio.pause();
    } else {

      this.state.audio.play();
    }

    this.setState({ isPlaying: !isPlaying });
  };

  render(): JSX.Element {
    return (
      <div className={styles["call-page-container"]}>
        <div className={styles["device-options-container"]}>
          <SelectComponent
            label="Video Input"
            value={this.state.videoInput}
            options={this.state.videoInputs}
            onChange={this.updateCurrentVideoInput}
          ></SelectComponent>
          <SelectComponent
            label="Audio Input"
            value={this.state.audioInput}
            options={this.state.audioInputs}
            onChange={this.updateCurrentAudioInput}
          ></SelectComponent>
          <SelectComponent
            label="Audio Output"
            value={this.state.audioOutput}
            options={this.state.audioOutputs}
            onChange={this.updateCurrentAudioOutput}
          ></SelectComponent>
          <div>
            <p>
              {this.state.isPlaying ?
                "Song is Playing" :
                "Song is Paused"}
            </p>

            <button onClick={this.playPause}>
              Play | Pause
            </button>
          </div>
        </div>

        <video
          ref={this.videoRef}
          className={styles["video"]}
          playsInline
          autoPlay
        ></video>
      </div>
    );
  }
}
