'use client'
import Link from "next/link";
import React from "react";

interface SidenavProps {
    user: any;
    logout: () => Promise<void>;
}

const Sidenav = ({user, logout}: SidenavProps) => {
    const name = user?.name;
    const isAdmin = user?.roles.some((role: any) => role.name === 'admin');

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-center pb-5">Scrum helper</h2>
            <div className="text-center pb-5">
                <p>Welcome, {name}</p>
                <button onClick={logout} className="btn btn-sm">Logout</button>
            </div>
            <ul className="menu bg-base-200 rounded-box w-56">
                <li>
                    <Link href="/dashboard">
                        <div className=" ">Dashboard</div>
                    </Link>
                </li>
                <li>
                    <Link href="/tasks">
                        <div className="">Tasks</div>
                    </Link>
                </li>
                {isAdmin && (
                    <li>
                        <Link href="/management">
                            <div className="">Management</div>
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidenav;
