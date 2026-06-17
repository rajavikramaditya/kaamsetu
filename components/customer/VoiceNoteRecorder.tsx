"use client";

import { useEffect, useRef, useState } from "react";

import {
  VOICE_UNSUPPORTED_MESSAGE,
  createVoiceMediaRecorder,
  isVoiceRecordingSupported,
  mapGetUserMediaError,
  mapRecorderSetupError,
  queryMicrophonePermission,
  voiceBlobToFile,
} from "@/lib/customer/voice-recorder";

const MAX_SECONDS = 60;

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
  const [supported] = useState(() => isVoiceRecordingSupported());
  const [micPermission, setMicPermission] = useState<PermissionState | "unknown">("unknown");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const mimeTypeRef = useRef("audio/webm");
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void queryMicrophonePermission().then(setMicPermission);
  }, []);

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

    if (!supported) {
      setError(VOICE_UNSUPPORTED_MESSAGE);
      return;
    }

    const permission = await queryMicrophonePermission();
    setMicPermission(permission);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      let recorder: MediaRecorder;
      let mimeType: string;
      try {
        ({ recorder, mimeType } = createVoiceMediaRecorder(stream));
      } catch (setupErr) {
        cleanupStream();
        setError(mapRecorderSetupError(setupErr));
        setStatus("idle");
        return;
      }

      mimeTypeRef.current = mimeType;
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onerror = () => {
        cleanupStream();
        setError("Recording failed. Try again or continue without voice.");
        setStatus("idle");
      };

      recorder.onstop = () => {
        cleanupStream();
        if (chunksRef.current.length === 0) {
          setError("Recording failed. Try again or continue without voice.");
          setStatus("idle");
          return;
        }

        const blob = new Blob(chunksRef.current, {
          type: mimeTypeRef.current.split(";")[0] || "audio/webm",
        });

        if (blob.size === 0) {
          setError("Recording failed. Try again or continue without voice.");
          setStatus("idle");
          return;
        }

        const file = voiceBlobToFile(blob, mimeTypeRef.current);
        const url = URL.createObjectURL(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setStatus("recorded");
        setError(null);
        onRecorded(file);
      };

      recorder.start(250);
      setStatus("recording");
      setSeconds(0);
      setMicPermission("granted");

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      cleanupStream();
      setError(mapGetUserMediaError(err));
      setStatus("idle");
      const latest = await queryMicrophonePermission();
      setMicPermission(latest);
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") {
      try {
        recorder.requestData();
      } catch {
        // Some browsers omit requestData support
      }
      recorder.stop();
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
          Record up to 60 seconds. Microphone access is requested only when you tap Record.
        </p>
      </div>

      {!supported && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {VOICE_UNSUPPORTED_MESSAGE}
        </p>
      )}

      {supported && micPermission === "granted" && status === "idle" && !error && (
        <p className="text-xs text-teal-700">Microphone access is allowed for this site.</p>
      )}

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

      {supported && (
        <div className="flex flex-wrap gap-2">
          {status === "idle" && (
            <>
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={startRecording}
                className="rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {error ? "Try recording again" : "Record voice note"}
              </button>
            </>
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
      )}
    </div>
  );
}
