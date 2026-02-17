"use client";

export default function OfflineContent() {
    return (
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
    );
}
