"use client"; // Marca este componente como un Client Component

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchStatistics } from "@/app/lib/api";

export default function TourneyStatistics() {
    const { tourneyId } = useParams();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getStatistics() {
            try {
               /* const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/statistics`);

                if (!statsRes.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const statsData = await statsRes.json();*/

                const data = await fetchStatistics(tourneyId);
                setStatistics(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (tourneyId) {
            getStatistics();
        }
    }, [tourneyId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!statistics) {
        return <div>No statistics found.</div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <h1>Statistics</h1>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Played</th>
                            <th scope="col">Points</th>
                            <th scope="col">Won</th>
                            <th scope="col">Draw</th>
                            <th scope="col">Lost</th>
                            <th scope="col">GF</th>
                            <th scope="col">GA</th>
                            <th scope="col">Diff</th>
                            <th scope="col">Perf</th>
                        </tr>
                        </thead>
                        <tbody>
                        {statistics.map((tourney, index) => (
                            <tr key={index}>
                                <th scope="row">{tourney.team_name}</th>
                                <td>{tourney.played}</td>
                                <td><b>{tourney.points}</b></td>
                                <td>{tourney.won}</td>
                                <td>{tourney.draw}</td>
                                <td>{tourney.lost}</td>
                                <td>{tourney.gf}</td>
                                <td>{tourney.ga}</td>
                                <td>{tourney.diff}</td>
                                <td>{tourney.perf}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
