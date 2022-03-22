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

				<h1>Select sources &amp; outputs</h1>

				<p>Get available audio, video sources and audio output devices from <code>mediaDevices.enumerateDevices()</code>
					then set the source for <code>getUserMedia()</code> using a <code>deviceId</code> constraint.</p>
				<p><b>Note:</b> without permission, the browser will restrict the available devices to at most one per type.</p>

				<div>
					<label>Audio input source: </label><select id="audioSource"></select>
				</div>

				<div>
					<label>Audio output destination: </label><select id="audioOutput"></select>
				</div>

				<div>
					<label>Video source: </label><select id="videoSource"></select>
				</div>


				<video ref={this.videoRef} playsInline autoPlay></video>

			</div>
		)
	}
}
