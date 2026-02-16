/**
 * Dashboard Layout Component
 */

'use client';

import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { useRequireAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { loading } = useRequireAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />
            <div className="flex">
                <DashboardSidebar />
                <main className="flex-1 p-4 sm:p-8 pb-24 sm:pb-8">
                    {children}
                </main>
            </div>
            <MobileBottomNav />
        </div>
    );
};
