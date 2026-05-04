import { FILE_CHUNK_SIZE, type FileMetadata } from "@webdrop/shared";

export type FileMessage =
  | { kind: "metadata"; file: FileMetadata }
  | { kind: "chunk"; index: number; bytes: ArrayBuffer }
  | { kind: "complete" };

export async function waitForBufferedAmount(channel: RTCDataChannel, maxBufferedAmount = FILE_CHUNK_SIZE * 8) {
  ensureOpenDataChannel(channel);

  if (channel.bufferedAmount <= maxBufferedAmount) return;

  await new Promise<void>((resolve, reject) => {
    const handleClose = () => {
      channel.onbufferedamountlow = null;
      reject(new Error("The WebRTC data channel closed during transfer."));
    };

    channel.bufferedAmountLowThreshold = maxBufferedAmount;
    channel.onbufferedamountlow = () => {
      channel.removeEventListener("close", handleClose);
      channel.onbufferedamountlow = null;
      resolve();
    };
    channel.addEventListener("close", handleClose, { once: true });
  });
}

export function sendDataChannelMessage(channel: RTCDataChannel, message: string | ArrayBuffer) {
  ensureOpenDataChannel(channel);
  if (typeof message === "string") {
    channel.send(message);
    return;
  }

  channel.send(message);
}

function ensureOpenDataChannel(channel: RTCDataChannel) {
  if (channel.readyState !== "open") {
    throw new Error(`The WebRTC data channel is ${channel.readyState}.`);
  }
}

export async function sendFileChunks(input: {
  file: File;
  fileMetadata: FileMetadata;
  channel: RTCDataChannel;
  onProgress: (sentBytes: number) => void;
}) {
  const metadata = JSON.stringify({ kind: "metadata", file: input.fileMetadata });
  sendDataChannelMessage(input.channel, metadata);

  let offset = 0;
  let chunkIndex = 0;

  while (offset < input.file.size) {
    const chunk = input.file.slice(offset, offset + FILE_CHUNK_SIZE);
    const buffer = await chunk.arrayBuffer();
    await waitForBufferedAmount(input.channel);
    sendDataChannelMessage(input.channel, buffer);

    offset += buffer.byteLength;
    input.onProgress(Math.min(offset, input.file.size));
    chunkIndex += 1;
  }

  sendDataChannelMessage(input.channel, JSON.stringify({ kind: "complete", chunks: chunkIndex }));
}

export function rebuildFile(chunks: ArrayBuffer[], metadata: FileMetadata): Blob {
  return new Blob(chunks, { type: metadata.type || "application/octet-stream" });
}
