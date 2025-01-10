'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/auth'
import Sidenav from "@/ui/Sidenav";

const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth({ middleware: 'auth' })

    return (
        <div className="flex">
            <Sidenav user={user} logout={logout} />
            {children}
        </div>
    )
}

export default AppLayout
