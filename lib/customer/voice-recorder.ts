export const VOICE_UNSUPPORTED_MESSAGE =
  "Voice recording is not supported on this browser. You can submit request without voice.";

export function isVoiceRecordingSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof MediaRecorder !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

export function createVoiceMediaRecorder(stream: MediaStream): {
  recorder: MediaRecorder;
  mimeType: string;
} {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("UNSUPPORTED");
  }

  if (MediaRecorder.isTypeSupported("audio/webm")) {
    return {
      recorder: new MediaRecorder(stream, { mimeType: "audio/webm" }),
      mimeType: "audio/webm",
    };
  }

  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return {
      recorder: new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" }),
      mimeType: "audio/webm;codecs=opus",
    };
  }

  return { recorder: new MediaRecorder(stream), mimeType: "audio/webm" };
}

export function voiceBlobToFile(blob: Blob, mimeType: string): File {
  const baseMime = (blob.type || mimeType || "audio/webm").split(";")[0];
  const ext =
    baseMime.includes("ogg")
      ? "ogg"
      : baseMime.includes("mp4") || baseMime.includes("aac")
        ? "m4a"
        : "webm";
  return new File([blob], `voice-note.${ext}`, { type: baseMime });
}
