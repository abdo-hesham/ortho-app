/**
 * Dashboard Header Component
 */

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export const DashboardHeader = () => {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            // Redirect to signin
            router.push('/signin');
            router.refresh(); // Refresh to clear any cached data
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo with Icon */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Medidect</h1>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.specialty.replace(/_/g, ' ')}</p>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => router.push('/profile')}
                        className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Go to profile"
                    >
                        <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};
