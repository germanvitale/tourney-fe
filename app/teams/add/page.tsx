"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {fetchConfederations, createTeam} from "@/app/lib/api";

export default function AddTeam() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [confederations, setConfederations] = useState([]);
    const [confederationId, setConfederationId] = useState('');
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const router = useRouter();

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    useEffect(() => {
        const getConfederations = async () => {
            try {
                /*const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/confederations`);
                const data = await response.json();*/



                const data = await fetchConfederations();
                setConfederations(data);
            } catch (error) {
                console.error('Error fetching confederations:', error);
            }
        };

      /*  const fetchPlayers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/players`);
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };*/

        getConfederations();
        //fetchPlayers();
    }, []);

    /*const handlePlayerChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedPlayers(selectedOptions);
    };*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        const teamData = { name, slug, confederation_id: confederationId, player_ids: selectedPlayers };

        try {
         /*   const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });*/


            await createTeam(teamData);
            router.push('/teams');

/*
            await getCsrfToken();
            const token = localStorage.getItem('accessToken');
            const xsrfToken = getCookie('XSRF-TOKEN');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(teamData)
            });

            console.log('piporeo');
            console.log(response);

            if (response.ok) {
                router.push('/teams');
            } else {
                console.error('Failed to add team');
            }*/
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Add Team</h1>
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
                    <label htmlFor="confederation" className="form-label">Group</label>
                    <select id="confederation" value={confederationId} onChange={(e) => setConfederationId(e.target.value)} className="form-select">
                        <option value="">Select a group</option>
                        {confederations.map((confederation) => (
                            <option key={confederation.id} value={confederation.id}>
                                {confederation.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Add Team</button>
            </form>
        </div>
    );
}
