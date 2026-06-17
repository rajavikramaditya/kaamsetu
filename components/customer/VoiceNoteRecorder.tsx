"use client";

import { useEffect, useRef, useState } from "react";

const MAX_SECONDS = 60;

function pickMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "audio/webm";
}

type VoiceNoteRecorderProps = {
  disabled?: boolean;
  onRecorded: (file: File) => void;
  uploading?: boolean;
  uploaded?: boolean;
};

export function VoiceNoteRecorder({
  disabled,
  onRecorded,
  uploading,
  uploaded,
}: VoiceNoteRecorderProps) {
  const [status, setStatus] = useState<"idle" | "recording" | "recorded">("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function cleanupStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function startRecording() {
    setError(null);
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Recording is not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        cleanupStream();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `voice-note.${ext}`, { type: blob.type });
        const url = URL.createObjectURL(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setStatus("recorded");
        onRecorded(file);
      };

      recorder.start(250);
      setStatus("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      cleanupStream();
      setError("Microphone permission denied or unavailable.");
      setStatus("idle");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    } else {
      cleanupStream();
    }
  }

  function resetRecording() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSeconds(0);
    setStatus("idle");
    setError(null);
  }

  if (uploaded) {
    return (
      <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
        Voice note uploaded successfully.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-stone-900">Voice note (optional)</p>
        <p className="mt-1 text-xs text-stone-500">
          Record up to 60 seconds describing the issue. Microphone access is requested only
          when you tap Record.
        </p>
      </div>

      {status === "recording" && (
        <p className="text-sm font-medium text-red-700">
          Recording… {seconds}s / {MAX_SECONDS}s
        </p>
      )}

      {previewUrl && status === "recorded" && (
        <audio controls src={previewUrl} className="w-full" />
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {status === "idle" && (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={startRecording}
            className="rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            Record voice note
          </button>
        )}

        {status === "recording" && (
          <button
            type="button"
            onClick={stopRecording}
            className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-medium text-white"
          >
            Stop recording
          </button>
        )}

        {status === "recorded" && !uploading && (
          <button
            type="button"
            onClick={resetRecording}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700"
          >
            Re-record
          </button>
        )}

        {uploading && (
          <span className="self-center text-sm text-stone-600">Uploading voice note…</span>
        )}
      </div>
    </div>
  );
}
