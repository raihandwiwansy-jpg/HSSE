'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WifiLoader from '@/components/ui/WifiLoader';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.replace('/dashboard');
        } else {
            router.replace('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A14] transition-colors duration-300">
            <WifiLoader text="Checking auth..." />
        </div>
    );
}

