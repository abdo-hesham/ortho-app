/**
 * Mobile Bottom Navigation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav = () => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path + '/');
    };

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16 px-4">
                {/* Profile */}
                <Link
                    href="/profile"
                    className="flex flex-col items-center justify-center flex-1 gap-1"
                >
                    <svg
                        className={`w-6 h-6 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <span className={`text-xs ${isActive('/profile') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                        Profile
                    </span>
                </Link>

                {/* Center placeholder for floating button */}
                <div className="flex-1"></div>

                {/* Patients */}
                <Link
                    href="/dashboard"
                    className="flex flex-col items-center justify-center flex-1 gap-1"
                >
                    <svg
                        className={`w-6 h-6 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span className={`text-xs ${isActive('/dashboard') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                        Patients
                    </span>
                </Link>
            </div>
        </nav>
    );
};
