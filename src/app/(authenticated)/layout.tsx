'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/auth'
import Sidenav from "@/ui/Sidenav";

const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth({ middleware: 'auth' })

    return (
        <div className="flex">
            <Sidenav user={user} logout={logout} />
            <div className="ml-56 w-full  overflow-y-auto">
                {children}
            </div>
        </div>
    )
}

export default AppLayout
