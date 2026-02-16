/**
 * PWA Install Prompt Component
 * Shows a sticky banner prompting users to install the app
 * Optimized for mobile doctors on-the-go
 */

"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isAppInstalled =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true;

        setIsInstalled(isAppInstalled);

        // Check if previously dismissed (expires after 7 days)
        const dismissedTime = localStorage.getItem("pwa-install-dismissed");
        if (dismissedTime) {
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            if (parseInt(dismissedTime) > weekAgo) {
                setIsDismissed(true);
            } else {
                localStorage.removeItem("pwa-install-dismissed");
            }
        }

        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(iOS);

        // Listen for install prompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Listen for successful install
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            if (isIOS) {
                setShowIOSInstructions(true);
            }
            return;
        }

        // Show install prompt
        deferredPrompt.prompt();

        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
            setIsInstallable(false);
        } else {
            console.log("User dismissed the install prompt");
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    };

    const handleIOSClose = () => {
        setShowIOSInstructions(false);
    };

    // Don't show if already installed, dismissed, or not installable (and not iOS)
    if (isInstalled || isDismissed || (!isInstallable && !isIOS)) {
        return null;
    }

    // iOS Instructions Modal
    if (showIOSInstructions) {
        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg
                                    className="w-7 h-7 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Install on iOS
                                </h3>
                                <p className="text-sm text-gray-500">Safari required</p>
                            </div>
                        </div>
                        <button
                            onClick={handleIOSClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close iOS install instructions"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                1
                            </div>
                            <div>
                                <p>
                                    Tap the <strong>Share button</strong> in Safari
                                </p>
                                <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                                    </svg>
                                    <span className="text-xs font-medium">Share</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                2
                            </div>
                            <div>
                                <p>
                                    Scroll and tap <strong>&quot;Add to Home Screen&quot;</strong>
                                </p>
                                <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-xs font-medium">Add to Home Screen</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                3
                            </div>
                            <div>
                                <p>
                                    Tap <strong>&quot;Add&quot;</strong> to install Medidect
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleIOSClose}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        );
    }

    // Main Install Banner - Floating Button Style
    return (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-right">
            {/* Floating Install Button */}
            <div className="relative">
                <button
                    onClick={handleInstallClick}
                    className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-blue-500/50 rounded-2xl px-5 py-4 transition-all duration-300 hover:scale-105 active:scale-95"
                    aria-label="Install Medidect App"
                >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </div>
                    
                    {/* Text */}
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                            {isIOS ? "Install App" : "Install App"}
                        </span>
                        <span className="text-xs text-blue-100 whitespace-nowrap">
                            Quick & Offline
                        </span>
                    </div>
                    
                    {/* Pulse indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg" />
                </button>
                
                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="absolute -top-2 -left-2 w-6 h-6 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                    aria-label="Dismiss install prompt"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
