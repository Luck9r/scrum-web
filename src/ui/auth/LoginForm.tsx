'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import { useSearchParams } from 'next/navigation';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';

const LoginForm = () => {
    const searchParams = useSearchParams();
    const { login } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/dashboard' });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    useEffect(() => {
        const resetToken = searchParams.get('reset');
        setStatus(resetToken ? atob(resetToken) : '');
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password, remember });
        } catch (error: Error | AxiosError | unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setErrors(error.response?.data?.errors);
            }
        } finally {
            setStatus('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <h1 className="text-2xl font-semibold">Login</h1>
            {status && <p className="text-sm text-green-500">{status}</p>}
            <div>
                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                        type="text"
                        className="grow"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
            </div>
            <div>
                {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>
                    <input
                        type="password"
                        placeholder="Password"
                        className="grow"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label className="label cursor-pointer">
                    Remember Me
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                </label>
            </div>
            <div className="flex items-center justify-between">
                <button className="btn btn-primary" type="submit">Login</button>
                <p className="text-sm text-center mr-0.5">
                    Don&#39;t have an account? <br/> <Link href="/register" className="text-primary">Register</Link>
                </p>
            </div>
            <p className="text-sm text-center">
                <Link href="/forgot-password" className="text-primary">Forgot Password?</Link>
            </p>
        </form>
    );
};

export default LoginForm;
