'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import axios from '@/lib/axios';
import { BoardData } from '@/interfaces/BoardData';
import BoardCard from "@/ui/BoardCard";

const Dashboard = () => {
    const { user } = useAuth({ middleware: 'auth' });
    const [boards, setBoards] = useState<BoardData[]>([]);

    const fetchBoards = async () => {
        try {
            const response = await axios.get('/api/boards');
            if (Array.isArray(response.data)) {
                setBoards(response.data);
            } else {
                console.error('Error: Expected an array of board');
            }
        } catch (error) {
            console.error('Error fetching board:', error);
        }
    };

    useEffect(() => {
        void fetchBoards();
    }, []);

    return (
        <div className="card bg-base-300 max-w-min shadow-xl mt-10 ml-10">
            <div className="card-body">
                <h2 className="card-title text-3xl font-semibold mb-4">Dashboard</h2>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold">User Information</h3>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p>
                        <strong>Email Verified:</strong> {user?.email_verified_at ? 'Yes' : 'No, check your inbox.'}
                        {!user?.email_verified_at && (
                            <Link href="/verify-email" className="text-primary ml-2">
                                Verify Email
                            </Link>
                        )}
                    </p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold mb-2">Boards</h3>
                        {boards.map((board) => (
                            <BoardCard board={board} key={board.id} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
