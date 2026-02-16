/**
 * Mobile Bottom Navigation
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBottomNavProps {
  onAddClick?: () => void;
}

export const MobileBottomNav = ({ onAddClick }: MobileBottomNavProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 sm:hidden">
      <nav className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl flex items-center justify-between px-6 py-2">
        {/* Home/Dashboard */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center gap-1 min-w-[3rem] transition-colors ${
            isActive("/dashboard") ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill={isActive("/dashboard") ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isActive("/dashboard") ? 2 : 1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* Center Add Button */}
        <div className="relative -top-5">
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all border-4 border-slate-50"
              aria-label="Add new patient"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 min-w-[3rem] transition-colors ${
            isActive("/profile") ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill={isActive("/profile") ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isActive("/profile") ? 2 : 1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};
