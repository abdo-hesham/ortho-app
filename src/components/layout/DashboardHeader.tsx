/**
 * Dashboard Header Component
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const DashboardHeader = () => {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get user initials
    const getInitials = (name: string = '') => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/signin');
            router.refresh();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-2 z-40 bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-blue-500/5 rounded-3xl supports-[backdrop-filter]:bg-white/60 max-w-[80%] mx-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-all duration-200">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight">
                                Medi<span className="text-blue-600">Care</span>
                            </span>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 p-1 rounded-full hover:bg-white/50 transition-colors focus:outline-none"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-semibold text-slate-700 leading-none">
                                        {user?.name || 'Dr. Smith'}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-medium">
                                        {user?.specialty?.replace(/_/g, ' ') || 'Cardiologist'}
                                    </span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white shadow-sm text-blue-600 font-bold text-sm">
                                    {getInitials(user?.name)}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-black ring-opacity-5 py-2 focus:outline-none transform origin-top-right transition-all duration-200 z-50">
                                    {/* Mobile User Info */}
                                    <div className="sm:hidden px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {user?.name || 'Doctor'}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="group flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <svg className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </Link>
                                    </div>

                                    <div className="border-t border-slate-50 my-1"></div>

                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full group flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
