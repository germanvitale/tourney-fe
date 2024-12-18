"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {fetchTourneys} from "../lib/api";

export default function TourneysPage() {
    const [tourneys, setTourneys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTourneys = async () => {
             try {
                const data = await fetchTourneys();
                setTourneys(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getTourneys();
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
                    <h1 className="title">Tournaments</h1>
                    <ul className="tournament-list">
                        {tourneys.map((tourney) => (
                            <li key={tourney.id} className="tournament-item">
                                <Link href={`/tourneys/${tourney.id}`}>
                                    <div className="tournament-card">
                                        <h2>{tourney.name}</h2>
                                        <p>Teams: {tourney.nteams}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="add-tournament">
                        <Link href={`/tourneys/add`}>
                            Add Tournament
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
