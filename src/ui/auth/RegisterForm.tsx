'use client'
import React, { useState } from 'react';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import { useAuth } from '@/hooks/auth';

const RegisterForm = () => {
    const { register } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/dashboard'});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<string>('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await register({ name, email, password, password_confirmation: password });
            // @ts-expect-error register does not have a proper response type
            setStatus(response.data.status);
        } catch (error: Error | AxiosError | unknown) {
            setStatus('');
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setErrors(error.response?.data?.errors);
            } else if (axios.isAxiosError(error) && error.response?.data.message) {
                setErrors({ name: error.response?.data?.message });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <h1 className="text-2xl font-semibold">Register</h1>
            {status && <p className="text-sm text-green-500">{status}</p>}
            <div>
                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input
                        type="text"
                        className="grow"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
            </div>
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
                        className="grow"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div className="flex items-center justify-between">
                <button className="btn btn-primary" type="submit">Register</button>
                <p className="text-sm text-center mr-3">
                    Have an account? <br/> <Link href="/login" className="text-primary">Login</Link>
                </p>
            </div>
        </form>
    );
};

export default RegisterForm;
