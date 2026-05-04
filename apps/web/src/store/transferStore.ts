"use client";

import { create } from "zustand";
import type { FileMetadata, TransferRequest } from "@webdrop/shared";
import type { ReceivedDownload, TransferPhase } from "@/types/transfer";

type TransferState = {
  selectedFile: File | null;
  selectedFileMetadata: FileMetadata | null;
  activeTransferId: string | null;
  incomingRequest: TransferRequest | null;
  outgoingRequest: TransferRequest | null;
  transferPhase: TransferPhase;
  progress: number;
  download: ReceivedDownload | null;
  errorMessage: string | null;
  setSelectedFile: (file: File | null, metadata: FileMetadata | null) => void;
  setActiveTransferId: (transferId: string | null) => void;
  setIncomingRequest: (request: TransferRequest | null) => void;
  setOutgoingRequest: (request: TransferRequest | null) => void;
  setTransferPhase: (phase: TransferPhase) => void;
  setProgress: (progress: number) => void;
  setDownload: (download: ReceivedDownload | null) => void;
  setErrorMessage: (message: string | null) => void;
  resetTransfer: () => void;
};

export const useTransferStore = create<TransferState>((set) => ({
  selectedFile: null,
  selectedFileMetadata: null,
  activeTransferId: null,
  incomingRequest: null,
  outgoingRequest: null,
  transferPhase: "idle",
  progress: 0,
  download: null,
  errorMessage: null,
  setSelectedFile: (selectedFile, selectedFileMetadata) => set({ selectedFile, selectedFileMetadata }),
  setActiveTransferId: (activeTransferId) => set({ activeTransferId }),
  setIncomingRequest: (incomingRequest) => set({ incomingRequest }),
  setOutgoingRequest: (outgoingRequest) => set({ outgoingRequest }),
  setTransferPhase: (transferPhase) => set({ transferPhase }),
  setProgress: (progress) => set({ progress }),
  setDownload: (download) => set({ download }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  resetTransfer: () =>
    set({
      selectedFile: null,
      selectedFileMetadata: null,
      activeTransferId: null,
      incomingRequest: null,
      outgoingRequest: null,
      transferPhase: "idle",
      progress: 0,
      download: null,
      errorMessage: null
    })
}));
