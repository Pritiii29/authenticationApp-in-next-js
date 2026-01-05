"use client"

import axios from "axios";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import Router from "next/router";


export default function VerifyEmailPage() {
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            axios.post('/api/users/verifyemail', { token })
            setVerified(true);
        } catch (error: any) {
            setError(true);
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")
        [1];
        setToken(urlToken || ' ');
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : 'Token not found'}</h2>
            {verified && (
                <div>
                    <h2 className="p-2 bg-green-500 text-black">Verified successfully</h2>
                    <Link href="/login">Login</Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="p-2 bg-red-500 text-black"> Error</h2>
                </div>
            )}
        </div>
    )
}