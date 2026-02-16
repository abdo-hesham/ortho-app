/**
 * VoiceInput Component
 * Voice recording button with visual feedback
 */

"use client";

import { useEffect } from "react";
import { useVoiceRecording, formatDuration } from "@/hooks/useVoiceRecording";

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
    className?: string;
}

export function VoiceInput({
    onTranscript,
    disabled,
    className = "",
}: VoiceInputProps) {
    const {
        isRecording,
        isProcessing,
        error,
        duration,
        startRecording,
        stopRecording,
        cleanup,
    } = useVoiceRecording({
        onTranscriptionComplete: onTranscript,
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);

    const handleClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className={className}>
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled || isProcessing}
                className={`
          relative p-3 rounded-lg transition-all duration-200
          ${isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
          ${isProcessing ? "opacity-50 cursor-wait" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          text-white shadow-md hover:shadow-lg
          disabled:hover:bg-blue-500
        `}
                title={
                    isRecording
                        ? "Click to stop recording"
                        : isProcessing
                            ? "Processing..."
                            : "Click to start voice input"
                }
            >
                {isProcessing ? (
                    <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : isRecording ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <rect x="6" y="6" width="8" height="8" rx="1" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}

                {/* Recording indicator */}
                {isRecording && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                )}
            </button>

            {/* Duration display */}
            {isRecording && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-600 whitespace-nowrap">
                    {formatDuration(duration)}
                </div>
            )}

            {/* Processing indicator */}
            {isProcessing && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-blue-600 whitespace-nowrap">
                    Transcribing...
                </div>
            )}

            {/* Error display */}
            {error && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-red-600 whitespace-nowrap max-w-xs truncate">
                    {error}
                </div>
            )}
        </div>
    );
}
