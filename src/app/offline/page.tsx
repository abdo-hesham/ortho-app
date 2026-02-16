/**
 * Offline Fallback Page
 * Shown when user is offline and page is not cached
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Offline - OrthoCare",
    description: "You are currently offline",
};

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Offline Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-14 h-14 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                                />
                            </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
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
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        You&apos;re Offline
                    </h1>
                    <p className="text-gray-600 mb-6">
                        It looks like you&apos;ve lost your internet connection. Some features
                        may be unavailable until you reconnect.
                    </p>

                    {/* Status Indicator */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">No connection</span>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="text-left bg-blue-50 rounded-xl p-4 mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            While you wait:
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Check your network connection</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Try toggling airplane mode</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Previously viewed pages may still be available</span>
                            </li>
                        </ul>
                    </div>

                    {/* Retry Button */}
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        Try Again
                    </button>

                    {/* Go Back Link */}
                    <button
                        onClick={() => window.history.back()}
                        className="mt-3 w-full text-blue-600 hover:text-blue-700 font-medium py-2 text-sm"
                    >
                        ← Go Back
                    </button>
                </div>

                {/* App Info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>OrthoCare Dashboard</p>
                    <p className="text-xs mt-1">PWA Offline Mode</p>
                </div>
            </div>
        </div>
    );
}
