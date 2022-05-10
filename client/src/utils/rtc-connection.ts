const connectionConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

export const createNewRTCPeerConnection = (): RTCPeerConnection => {
  return new RTCPeerConnection(connectionConfig);
};
