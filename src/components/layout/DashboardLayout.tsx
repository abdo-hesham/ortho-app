/**
 * Dashboard Layout Component
 */

'use client';

import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { useRequireAuth } from '@/hooks/useAuth';
import { GlobalLoader } from '../ui/GlobalLoader';

interface DashboardLayoutProps {
    children: React.ReactNode;
    onAddClick?: () => void;
}

export const DashboardLayout = ({ children, onAddClick }: DashboardLayoutProps) => {
    const { loading } = useRequireAuth();

    if (loading) {
        return <GlobalLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />
            <div className="flex justify-center items-center">
                {/* <DashboardSidebar /> */}
                <main className="flex-1 p-4 sm:p-8 pb-24 sm:pb-8 w-full mx-auto">
                    {children}
                </main>
            </div>
            <MobileBottomNav onAddClick={onAddClick} />
        </div>
    );
};
