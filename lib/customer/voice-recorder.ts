export const VOICE_GENERIC_FAILURE =
  "Voice recording failed on this browser. You can submit without voice.";

export const VOICE_UNSUPPORTED_MESSAGE =
  "Voice recording is not supported on this browser. You can submit request without voice.";

export async function queryMicrophonePermission(): Promise<PermissionState | "unknown"> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return "unknown";
  }
  try {
    const result = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return result.state;
  } catch {
    return "unknown";
  }
}

export function mapGetUserMediaError(err: unknown): string {
  if (!(err instanceof DOMException)) {
    return VOICE_GENERIC_FAILURE;
  }
  if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
    return "Microphone permission denied. Tap Try recording again or continue without voice.";
  }
  if (err.name === "NotFoundError") {
    return "No microphone found on this device. You can continue without voice.";
  }
  if (err.name === "NotReadableError" || err.name === "AbortError") {
    return "Microphone is unavailable right now. You can continue without voice.";
  }
  return VOICE_GENERIC_FAILURE;
}

export function mapRecorderSetupError(err: unknown): string {
  if (err instanceof DOMException && err.name === "NotSupportedError") {
    return VOICE_UNSUPPORTED_MESSAGE;
  }
  return VOICE_GENERIC_FAILURE;
}

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
    throw new DOMException("MediaRecorder unsupported", "NotSupportedError");
  }

  const candidates: Array<{ mimeType?: string; label: string }> = [
    { mimeType: "audio/webm", label: "audio/webm" },
    { mimeType: "audio/webm;codecs=opus", label: "audio/webm;codecs=opus" },
    { mimeType: undefined, label: "audio/webm" },
  ];

  for (const candidate of candidates) {
    if (
      candidate.mimeType &&
      !MediaRecorder.isTypeSupported(candidate.mimeType)
    ) {
      continue;
    }
    try {
      const recorder = candidate.mimeType
        ? new MediaRecorder(stream, { mimeType: candidate.mimeType })
        : new MediaRecorder(stream);
      return { recorder, mimeType: candidate.label };
    } catch {
      continue;
    }
  }

  throw new DOMException("No supported audio recorder", "NotSupportedError");
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
