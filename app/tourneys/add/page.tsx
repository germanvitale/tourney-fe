"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {createTourney} from "@/app/lib/api";

interface Team {
    id: number;
    name: string;
}

interface Confederation {
    id: number;
    name: string;
    teams: Team[];
}

export default function AddTourney() {
    const [name, setName] = useState('');
    const [type, setType] = useState('league');
    const [mode, setMode] = useState('simple');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        console.log('los guapos');

        e.preventDefault();
        const tournamentData = { name: name, type: type, mode: mode};
        try {
            const data = await createTourney(tournamentData);
            router.push(`/tourneys/${data.id}`);

       /*     console.log('data');
            console.log(tournamentData);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourneys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(tournamentData)
            });

            console.log('response');
            console.log(response);

            router.push(`/tourneys/${response.id}`);*/

        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Create Tournament</h1>
            <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="form-select"
                            required>
                        <option value="league">League</option>
                        <option value="knockout">Knockout</option>
                        <option value="groups-knockout">Groups+Knockout</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="mode" className="form-label">Matches</label>
                    <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)} className="form-select"
                            required>
                        <option value="simple">Simple</option>
                        <option value="double">Double</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Create Tournament</button>
            </form>
        </div>
    );
}
