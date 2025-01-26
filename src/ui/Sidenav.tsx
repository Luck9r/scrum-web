'use client'
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { BsBoxArrowRight } from 'react-icons/bs';

interface SidenavProps {
    user: any;
    logout: () => Promise<void>;
}

const Sidenav = ({user, logout}: SidenavProps) => {
    const name = user?.name;
    const isAdmin = user?.roles.some((role: any) => role.name === 'admin');

    return (
        <aside className="fixed top-0 left-0 h-full p-4 z-50 bg-base-200">
            <div className="flex justify-center items-center pb-6 pt-20">
                <Image src="/icon.png" alt="Icon" width={120} height={120}/>
            </div>
            <h2 className="text-xl font-bold text-center pb-5">Scrum helper</h2>
            <div className="text-center pb-5">
                <p>Welcome, {name}</p>
                <button onClick={logout} className="btn btn-sm">
                    Logout <BsBoxArrowRight />
                </button>
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
        </aside>
    );
};

export default Sidenav;
