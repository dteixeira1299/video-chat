export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream(): MediaStream;
}

export const getUserDevices = (): Promise<MediaDeviceInfo[]> => {
  return navigator.mediaDevices.enumerateDevices();
};

export const getUserMedia = (
  videoConstraint: any,
  audioConstraints: any
): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    video: videoConstraint,
    audio: audioConstraints
  });
};

export const getUserStream = async (
  videoInput?: string,
  audioInput?: string
): Promise<MediaStream> => {
  const userDevices = await getUserDevices();
  const hasVideo = userDevices.filter(device => device.kind == "videoinput");
  const videoConstraint = videoInput
    ? { deviceId: { exact: videoInput } }
    : hasVideo.length > 0;
  const audioConstraint = audioInput
    ? { deviceId: { exact: audioInput } }
    : true;

  return getUserMedia(videoConstraint, audioConstraint);
};

export const toogleAudioInput = (stream?: MediaStream): void => {
  if (stream) {
    stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
  }
};

export const toogleVideo = (stream?: MediaStream): void => {
  if (stream) {
    stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  }
};
