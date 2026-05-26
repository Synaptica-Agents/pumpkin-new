import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type RecordingState = "idle" | "recording" | "transcribing";

interface UseAudioRecordingOptions {
  onTranscript: (text: string) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("FileReader returned non-string"));
        return;
      }
      // result is e.g. "data:audio/webm;base64,XXXXX"
      const commaIdx = result.indexOf(",");
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });

const detectFormat = (mimeType: string): string => {
  const m = mimeType.toLowerCase();
  if (m.includes("ogg")) return "ogg";
  if (m.includes("mp4")) return "mp4";
  if (m.includes("wav")) return "wav";
  return "webm";
};

/**
 * Records mic audio, sends it to the `transcribe-audio` edge function,
 * and invokes onTranscript(text) with the German transcription on success.
 */
export const useAudioRecording = ({ onTranscript }: UseAudioRecordingOptions) => {
  const [state, setState] = useState<RecordingState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTicker = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const stop = useCallback(() => {
    const mr = recorderRef.current;
    if (mr && mr.state === "recording") {
      mr.stop();
    }
  }, []);

  const start = useCallback(async () => {
    if (state !== "idle") return;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error("getUserMedia failed:", e);
      toast.error("Mikrofon-Zugriff verweigert. Bitte Browser-Berechtigung pruefen.");
      return;
    }

    let mr: MediaRecorder;
    try {
      mr = new MediaRecorder(stream);
    } catch (e) {
      console.error("MediaRecorder ctor failed:", e);
      toast.error("Browser unterstützt keine Audio-Aufnahme.");
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    chunksRef.current = [];
    mr.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
    };

    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      stopTicker();
      setElapsed(0);

      const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
      if (blob.size === 0) {
        setState("idle");
        return;
      }

      setState("transcribing");
      try {
        const base64 = await blobToBase64(blob);
        const format = detectFormat(mr.mimeType || "audio/webm");
        const { data, error } = await supabase.functions.invoke("transcribe-audio", {
          body: { audio_data: base64, format },
        });
        if (error) {
          console.error("transcribe-audio error:", error);
          toast.error("Transkription fehlgeschlagen.");
        } else if (data?.error) {
          toast.error(data.error);
        } else if (typeof data?.transcript === "string" && data.transcript.trim().length > 0) {
          onTranscript(data.transcript.trim());
        } else {
          toast.error("Keine Transkription erhalten.");
        }
      } catch (e) {
        console.error("Transcription failure:", e);
        toast.error("Transkription fehlgeschlagen.");
      } finally {
        setState("idle");
      }
    };

    mr.start();
    recorderRef.current = mr;
    startedAtRef.current = Date.now();
    setElapsed(0);
    tickRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
    setState("recording");
  }, [state, onTranscript]);

  useEffect(() => {
    return () => {
      stopTicker();
      const mr = recorderRef.current;
      if (mr && mr.state === "recording") {
        try {
          mr.stop();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  return { state, elapsed, start, stop };
};
