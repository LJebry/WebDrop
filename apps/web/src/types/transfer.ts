export type TransferPhase =
  | "idle"
  | "requesting"
  | "incoming"
  | "connecting"
  | "transferring"
  | "complete"
  | "rejected"
  | "failed";

export type ReceivedDownload = {
  fileName: string;
  fileType: string;
  size: number;
  url: string;
};
