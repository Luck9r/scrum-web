'use client'
import React, { useState } from 'react'
import { useAuth } from '@/hooks/auth'

const VerifyEmailForm = () => {
    const [status, setStatus] = useState<string>('')

    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
    })

    const onClickResend = () => {
        resendEmailVerification().then(response => setStatus(response.data.status))
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl font-semibold">Verify Email</h2>
                <p className="text-base-content mb-4 text-sm text-gray-600">
                    Please verify your email address to continue using the link sent to you.<br/>
                    If you did not receive the email, please click the button below.
                </p>

                {status === 'verification-link-sent' && (
                    <p className="mb-4 font-medium text-sm text-green-600">
                        A new verification link has been sent to the email address you
                        provided during registration.
                    </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <button
                        className="btn btn-primary"
                        onClick={onClickResend}>
                        Resend Verification Email
                    </button>

                    <button
                        type="button"
                        className="btn btn-accent"
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailForm
