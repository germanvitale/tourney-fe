'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {login} from "@/app/lib/api";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login({ email, password });
            router.push('/tourneys');
        } catch (error) {
            setError(error.message);
        }
    };













    /* CSRF case
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Obtener CSRF token si usas Laravel Sanctum
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });
            console.log('aqui login');
            console.log(password);
            console.log(email);

            await getCsrfToken();
            const xsrfToken = getCookie('XSRF-TOKEN');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken
                },
                credentials: 'include', // Necesario para las cookies de Laravel Sanctum
                body: JSON.stringify({ email, password }),
            });

            console.log('res');
            console.log(res);

            if (!res.ok) throw new Error('Failed to login');

            console.log('res');
            console.log(res);


            const token = res.token;


            const data = await res.json();

            localStorage.setItem('accessToken', data.token);

            // Redirige a una página protegida o dashboard después del login
            router.push('/tourneys');
        } catch (error) {
            setError(error.message);
        }
    };*/



/*    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('aqui login');
            console.log(password);
            console.log(email);

            const data = { email: email, password: password};
            console.log('aqui login 2');
            console.log(password);
            console.log(email);
            await login(data);

            console.log('aqui login 3');
            console.log(password);
            console.log(email);
            // Redirige a una página protegida o dashboard después del login
            router.push('/tourneys');
        } catch (error) {
            setError(error.message);
        }
    };
*/



    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
