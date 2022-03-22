import { Component, createRef, RefObject, ChangeEvent } from "react";
import styles from "../styles/Call.module.css";

interface CallPageModel {
  videoInput?: string;
  videoInputs: DeviceModel[];
}

interface DeviceModel {
  id: string;
  label: string;
}

export class CallPage extends Component<{}, CallPageModel> {
  private videoRef: RefObject<HTMLVideoElement>;

  constructor(props: {}) {
    super(props);
    this.state = { videoInputs: [] };
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

  private async updateCurrentVideoInput(
    event: ChangeEvent<HTMLSelectElement>
  ): Promise<void> {
    this.setState({ videoInput: event.target.value });
    await this.startUserMedia();
  }

  private async startUserMedia(): Promise<void> {
    const mediaStream = await this.getUserMedia();

    if (this.videoRef.current) {
      this.videoRef.current.srcObject = mediaStream;
    }
  }

  private async fillInputOptions(): Promise<void> {
    const devices = await this.getUserDevices();

    devices.forEach((deviceInfo: MediaDeviceInfo) => {
      const device = { id: deviceInfo.deviceId, label: deviceInfo.label };

      if (deviceInfo.kind === "videoinput") {
        this.setState((state) => ({
          videoInputs: [...state.videoInputs, device],
        }));
      }
    });

    if (this.state.videoInputs.length) {
      this.setState((state) => ({ videoInput: state.videoInputs[0].id }));
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
          : undefined,
      },
      audio: false,
    });
  }

  render(): JSX.Element {
    return (
      <div className={styles["call-page-container"]}>
        <div className={styles["device-options-container"]}>
          <select
            value={this.state.videoInput}
            onChange={this.updateCurrentVideoInput}
          >
            {this.state.videoInputs.map((videoDevice) => {
              return (
                <option key={videoDevice.id} value={videoDevice.id}>
                  {videoDevice.label}
                </option>
              );
            })}
          </select>
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
