/**
 * useBrowserVoiceRecording Hook
 * Uses browser's built-in Web Speech API (SpeechRecognition)
 * FREE - No API costs, works offline, instant results
 */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface BrowserVoiceRecordingOptions {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useBrowserVoiceRecording(options?: BrowserVoiceRecordingOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [interimText, setInterimText] = useState("");

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>("");

  // Check browser support
  const isSupported = typeof window !== "undefined" && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  /**
   * Initialize and start speech recognition
   */
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const errorMsg = "Speech recognition not supported in this browser. Try Chrome or Edge.";
      setError(errorMsg);
      options?.onError?.(errorMsg);
      return;
    }

    try {
      setError(null);
      setDuration(0);
      setInterimText("");
      finalTranscriptRef.current = "";

      // Create SpeechRecognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configure recognition
      recognition.continuous = options?.continuous ?? true; // Keep listening
      recognition.interimResults = true; // Get partial results
      recognition.lang = options?.language ?? "en-US";
      recognition.maxAlternatives = 1;

      // Handle results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        if (final) {
          finalTranscriptRef.current += final;
        }
        setInterimText(interim);
      };

      // Handle end
      recognition.onend = () => {
        if (isRecording) {
          // Get final text
          const finalText = finalTranscriptRef.current.trim();
          if (finalText) {
            options?.onTranscriptionComplete?.(finalText);
          }
        }
        setIsRecording(false);
        setInterimText("");
        
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
      };

      // Handle errors
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = "Speech recognition error";
        
        switch (event.error) {
          case "no-speech":
            errorMessage = "No speech detected. Please try again.";
            break;
          case "audio-capture":
            errorMessage = "Microphone not found. Please check your device.";
            break;
          case "not-allowed":
            errorMessage = "Microphone access denied. Please enable in browser settings.";
            break;
          case "network":
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = `Error: ${event.error}`;
        }
        
        setError(errorMessage);
        options?.onError?.(errorMessage);
        setIsRecording(false);
      };

      recognition.onstart = () => {
        setIsRecording(true);
        // Start duration counter
        durationIntervalRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start speech recognition";
      setError(errorMessage);
      options?.onError?.(errorMessage);
    }
  }, [isSupported, options, isRecording]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  /**
   * Clean up on unmount
   */
  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    isRecording,
    isProcessing: false, // Always false for browser-based (instant results)
    error,
    duration,
    interimText,
    isSupported,
    startRecording,
    stopRecording,
    cleanup,
  };
}

/**
 * Format duration as MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
