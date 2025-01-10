'use client'
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';

const Dashboard = () => {
    const { user } = useAuth({ middleware: 'auth' });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">User Information</h2>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-2">Boards</h2>
                <ul className="list-disc list-inside">
                    <li><Link href="/boards/1" className="text-primary">Board 1</Link></li>
                    <li><Link href="/boards/2" className="text-primary">Board 2</Link></li>
                    <li><Link href="/boards/3" className="text-primary">Board 3</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
