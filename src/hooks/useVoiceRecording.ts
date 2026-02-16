/**
 * useVoiceRecording Hook
 * High-quality voice recording for medical transcription
 * Uses MediaRecorder API with optimal settings for clarity
 */

"use client";

import { useState, useRef, useCallback } from "react";

export interface VoiceRecordingOptions {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecording(options?: VoiceRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Send audio to API for transcription
   */
  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }

      const data = await response.json();

      if (data.text) {
        options?.onTranscriptionComplete?.(data.text);
      } else {
        throw new Error("No transcription text received");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Transcription failed";
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
      setDuration(0);
    }
  }, [options]);

  /**
   * Start recording with optimal medical-grade settings
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setDuration(0);
      chunksRef.current = [];

      // Request microphone access with constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // High-quality settings for medical clarity
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000, // High sample rate for clarity
          channelCount: 1, // Mono is fine for voice
        },
      });

      streamRef.current = stream;

      // Determine best supported MIME type
      const mimeType = getSupportedMimeType();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // High bitrate for clarity
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Only transcribe if we have audio data
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          await handleTranscription(blob);
        }

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        
        chunksRef.current = [];
      };

      mediaRecorder.onerror = (event) => {
        const errorMessage = "Recording error occurred";
        setError(errorMessage);
        options?.onError?.(errorMessage);
        setIsRecording(false);
        
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access microphone";
      setError(errorMessage);
      options?.onError?.(errorMessage);

      if (errorMessage.includes("Permission denied")) {
        setError(
          "Microphone access denied. Please enable in browser settings.",
        );
      }
    }
  }, [handleTranscription, options]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, []);



  /**
   * Clean up on unmount
   */
  const cleanup = useCallback(() => {
    // Stop media recorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    
    // Clear interval
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    
    // Reset state
    setIsRecording(false);
    setIsProcessing(false);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    isProcessing,
    error,
    duration,
    startRecording,
    stopRecording,
    cleanup,
  };
}

/**
 * Get best supported MIME type for recording
 * Prioritizes quality and compatibility
 */
function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus", // Best quality, widely supported
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
    "audio/wav",
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return ""; // Use browser default
}

/**
 * Format duration as MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
