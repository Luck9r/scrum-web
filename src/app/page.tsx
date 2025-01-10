'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth';

const Home = () => {
    const { user } = useAuth({middleware: 'guest'});
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl text-primary">Redirecting...</h1>
        </div>
    );
};

export default Home;
