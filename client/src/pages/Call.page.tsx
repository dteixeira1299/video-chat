import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { Component, createRef, RefObject, ChangeEvent } from "react";
import { SelectComponent, SelectOption } from "../components/Select.component";
import styles from "../styles/Call.module.css";

interface CallPageModel {
  stream?: MediaStream;
}

interface HTMLCallElement extends HTMLVideoElement {
  setSinkId(id: string): void;
}

export class CallPage extends Component<{}, CallPageModel> {
  private videoRef: RefObject<HTMLCallElement>;

  constructor(props: {}) {
    super(props);
    this.videoRef = createRef();
  }

  componentDidMount = (): void => {
    this.getUserMedia()
      .then(this.startUserMedia)
      .catch((error: Error) => console.log(error));
  };

  private startUserMedia = (mediaStream: MediaStream): void => {
    if (this.videoRef.current) {
      this.videoRef.current.srcObject = mediaStream;
      this.setState({ stream: mediaStream });
    }
  };

  private getUserDevices = (): Promise<MediaDeviceInfo[]> => {
    return navigator.mediaDevices.enumerateDevices();
  };

  private getUserMedia = async (): Promise<MediaStream> => {
    const hasVideo = (await this.getUserDevices()).filter(
      device => device.kind == "videoinput"
    );

    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
  };

  render = (): JSX.Element => {
    return (
      <div className={styles["video-container"]}>
        <video
          ref={this.videoRef}
          className={styles["video"]}
          playsInline
          autoPlay
        ></video>
      </div>
    );
  };
}
