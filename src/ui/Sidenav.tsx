'use client'
import Link from "next/link";
import React from "react";

interface SidenavProps {
    //eslint-disable-next-line
    user: any;
    logout: () => Promise<void>;
};

const Sidenav = ({user, logout}: SidenavProps) => {
    const name = user?.name;
    console.log(user)
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-center pb-5">Navigation</h2>
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
                <li>
                    <Link href="/settings">
                        <div className="">Settings</div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidenav;
