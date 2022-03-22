import { Component, createRef, RefObject } from "react";
import styles from "../styles/Call.module.css";

export class CallPage extends Component {
	private videoRef: RefObject<HTMLVideoElement>;

	constructor(props: {}) {
		super(props);
		this.videoRef = createRef();
	}

	async componentDidMount(): Promise<void> {
		try {
			const mediaStream = await this.getUserMedia();
			this.startVideo(mediaStream);
		} catch (e) {
			console.error(e)
		}
	}

	async getUserMedia(): Promise<MediaStream> {
		return await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		});
	}

	startVideo(stream: MediaStream): void {
		if (this.videoRef.current) {
			this.videoRef.current.srcObject = stream;
		}
	}

	render(): JSX.Element {
		return (
			<div>
				<video ref={this.videoRef} playsInline autoPlay></video>
			</div>
		)
	}
}
