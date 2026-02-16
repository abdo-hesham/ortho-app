/**
 * SearchBar Component
 * Global search input for filtering patients
 */

"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

import { transcribeAudio } from "@/app/actions/transcribe";

export function SearchBar({
    onSearch,
    placeholder = "Search patients...",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('file', file);

                setIsProcessing(true);
                try {
                    const result = await transcribeAudio(formData);
                    if (result.text) {
                        setQuery(result.text);
                    } else if (result.error) {
                        console.error(result.error);
                        alert("Failed to transcribe audio. Please try again.");
                    }
                } catch (err) {
                    console.error("Transcription error:", err);
                    alert("An error occurred during transcription.");
                } finally {
                    setIsProcessing(false);
                    // Stop all tracks to release microphone
                    stream.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setIsListening(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure permission is granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
    };

    const handleVoiceClick = () => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="relative w-full">
            <div className={`relative flex items-center w-full h-14 rounded-2xl focus-within:shadow-lg bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] border transition-all duration-300 transform focus-within:-translate-y-0.5 ${isListening || isProcessing ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                <div className="grid place-items-center h-full w-12 text-slate-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <input
                    className="peer h-full w-full outline-none text-sm text-slate-700 pr-2 bg-transparent placeholder-slate-400 font-medium"
                    type="text"
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isListening ? "Listening..." : isProcessing ? "Processing..." : placeholder}
                    disabled={isListening || isProcessing}
                />

                <div className="flex items-center pr-4 gap-2">
                    {query && !isListening && !isProcessing && (
                        <button
                            onClick={handleClear}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <button 
                        onClick={handleVoiceClick}
                        className={`p-2 rounded-xl transition-all duration-300 ${
                            isListening ? 'bg-red-50 text-red-500 animate-pulse' : 
                            isProcessing ? 'bg-blue-50 text-blue-500 animate-spin' :
                            'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                        title={isListening ? "Stop recording" : "Search by voice"}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        ) : isListening ? (
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5V21M8 21h8" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
