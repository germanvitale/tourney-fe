"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {fetchTeams} from "@/app/lib/api";

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getTeams() {
            try {
                const data = await fetchTeams();

                setTeams(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        getTeams();
    }, []);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="title">Teams</h1>
                    <ul className="team-list">
                        {teams.map((team) => (
                            <li key={team.id} className="team-item">
                                <Link href={`/teams/${team.id}`}>
                                    <div className="team-card">
                                        <h2>{team.name}</h2>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="add-team">
                        <Link href={`/teams/add`}>
                            Add Team
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
