/**
 * FormInputWithVoice Component
 * Text input with integrated voice recording button
 */

"use client";

import { forwardRef, useEffect, useMemo } from "react";
import { useVoiceRecording, formatDuration } from "@/hooks/useVoiceRecording";

interface FormInputWithVoiceProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    voiceIcon?:boolean;
    onVoiceTranscript?: (text: string) => void;
}

export const FormInputWithVoice = forwardRef<HTMLInputElement, FormInputWithVoiceProps>(
    ({ label, error, helperText, required, voiceIcon=true, className = "", onVoiceTranscript, ...props }, ref) => {
        const voiceOptions = useMemo(() => ({
            onTranscriptionComplete: onVoiceTranscript,
        }), [onVoiceTranscript]);
        
        const {
            isRecording,
            isProcessing,
            error: voiceError,
            duration,
            startRecording,
            stopRecording,
            cleanup,
        } = useVoiceRecording(voiceOptions);

        // Cleanup on unmount
        useEffect(() => {
            return () => cleanup();
        }, [cleanup]);

        const handleVoiceClick = () => {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        };

        return (
            <div className="w-full mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative ">
                    <input
                        ref={ref}
                        className={`
                            block w-full px-4 py-2.5 pr-12 border rounded-lg
                            text-gray-900 placeholder-gray-400
                            transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            ${error
                                ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 bg-white"
                            }
                            ${props.disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                            ${className}
                        `}
                        {...props}
                    />

                    {/* Voice Recording Button */}
                    {voiceIcon && (
                    <button
                        type="button"
                        onClick={handleVoiceClick}
                        disabled={props.disabled || isProcessing}
                        className={`
                            absolute right-2 top-1/2 -translate-y-1/2
                            p-2 rounded-lg transition-all duration-200
                            ${isRecording
                                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                : "bg-blue-500 hover:bg-blue-600"
                            }
                            ${isProcessing ? "opacity-50 cursor-wait" : ""}
                            ${props.disabled ? "opacity-30 cursor-not-allowed" : ""}
                            text-white shadow-sm hover:shadow-md
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
                                className="w-4 h-4 animate-spin"
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
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <rect x="6" y="6" width="8" height="8" rx="1" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}

                        {/* Recording indicator dot */}
                        {isRecording && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-ping" />
                        )}
                    </button>
                    )}

                    {/* Recording duration */}
                    {isRecording && (
                        <div className="absolute -bottom-6 right-2 text-xs font-mono text-red-600 font-bold bg-white px-2 py-0.5 rounded-md shadow-md border border-red-200 z-10">
                            🎙️ REC {formatDuration(duration)}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </p>
                )}
                {voiceError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {voiceError}
                    </p>
                )}
                {helperText && !error && !voiceError && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
                {isProcessing && (
                    <p className="mt-1 text-sm text-blue-600">Transcribing...</p>
                )}
            </div>
        );
    }
);

FormInputWithVoice.displayName = "FormInputWithVoice";
