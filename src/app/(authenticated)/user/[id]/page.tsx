'use client'
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useParams } from 'next/navigation';
import withRole from "@/components/withRole";
import Link from "next/link";

interface UserData {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

const possibleRoles = ['developer', 'scrum_master', 'product_owner', 'admin'];

const UserPage: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const userId = params.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/user/${userId}`);
                setUser(response.data);
                setSelectedRoles(response.data.roles);
            } catch (error: any) {
                setError('Failed to fetch user data.' + error.message);
            }
        };

        void fetchUser();
    }, [userId]);

    const handleRoleChange = (role: string) => {
        setSelectedRoles(prevRoles =>
            prevRoles.includes(role)
                ? prevRoles.filter(r => r !== role)
                : [...prevRoles, role]
        );
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/user/${userId}`, { roles: selectedRoles });
            alert('Roles updated successfully.');
        } catch (error) {
            setError('Failed to update roles.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col w-80 items-center ml-10">
            <Link href="/management"><button className="btn btn-primary">Return to Management</button></Link>
        <div className="card w-80 bg-base-300 m-10 p-4">
            <div className="card-title text-2xl mx-4 mt-4"><h1 className="">User: {user.name}</h1></div>
            <p className="ml-4">Email: {user.email}</p>
            <div className="card-body mx-4">
                <h2 className="text-xl font-semibold">Roles</h2>
                <div className="flex flex-col">
                    {possibleRoles.map(role => (
                        <label key={role} className="mb-2">
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(role)}
                                onChange={() => handleRoleChange(role)}
                                className="mr-2"
                            />
                            {role}
                        </label>
                    ))}
                </div>
            </div>
            <button onClick={handleSave} className="btn btn-primary mt-4">Save Changes</button>
        </div>
        </div>
    );
};


const ProtectedUserPage = withRole(UserPage, ['admin', 'product_owner'])
export default ProtectedUserPage;
