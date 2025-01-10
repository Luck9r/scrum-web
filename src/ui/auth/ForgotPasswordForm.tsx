'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { useAuth } from '@/hooks/auth';

const ForgotPasswordForm = () => {
    const { forgotPassword } = useAuth({ middleware: 'guest' });
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await forgotPassword({ email });
            setStatus(response.data.status);
        } catch (error: Error | AxiosError | unknown) {
            setStatus('');
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setErrors(error.response?.data?.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <h1 className="text-2xl font-semibold">Forgot Password</h1>
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
                        type="email"
                        className="grow"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div className="flex items-center justify-between">
                <button className="btn btn-primary" type="submit">Send Reset Link</button>
                <p className="text-sm mx-1">
                    Remembered your <br/>password? <Link href="/login" className="text-primary">Login</Link>
                </p>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
