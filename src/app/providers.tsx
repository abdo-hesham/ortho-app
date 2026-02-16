/**
 * Client-side Providers
 * 
 * Wraps the app with necessary context providers.
 * This component is marked as 'use client' to enable client-side features.
 */

'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
