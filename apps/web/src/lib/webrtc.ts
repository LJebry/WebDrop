import { WEBRTC_ICE_SERVERS } from "@webdrop/shared";

export function createPeerConnection(): RTCPeerConnection {
  return new RTCPeerConnection({
    iceServers: [...WEBRTC_ICE_SERVERS]
  });
}

export function createFileDataChannel(peerConnection: RTCPeerConnection): RTCDataChannel {
  const channel = peerConnection.createDataChannel("webdrop-file-transfer", {
    ordered: true
  });
  channel.binaryType = "arraybuffer";
  return channel;
}
