'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';

const withRole = (Component: React.ComponentType, roles: string[]) => {
    const WrappedComponent = (props: any) => {
        const { user } = useAuth({ middleware: 'auth' });
        const [authorized, setAuthorized] = useState<boolean | null>(null);

        useEffect(() => {
            if (!user) {
                setAuthorized(null);
            } else {
                const userRoles = user.roles.map((role: any) => role.name);
                const hasRole = roles.some(role => userRoles.includes(role));
                setAuthorized(hasRole);
            }
        }, [user, roles]);

        if (authorized === null) {
            return <div>Loading...</div>;
        }

        if (!authorized) {
            return <div>Unauthorized</div>;
        }

        return <Component {...props} />;
    };

    WrappedComponent.displayName = `withRole(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
};

export default withRole;
