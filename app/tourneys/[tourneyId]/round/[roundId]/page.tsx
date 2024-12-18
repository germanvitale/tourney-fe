"use client"; // Marca este componente como un Client Component

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RoundDetails() {
    const { tourneyId, roundId } = useParams();
    const router = useRouter();
    const [statistics, setStatistics] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasNextRound, setHasNextRound] = useState(true);
    const [hasPreviousRound, setHasPreviousRound] = useState(parseInt(roundId) > 1);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, gamesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/round/${roundId}/statistics`),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/round/${roundId}/games`)
                ]);

                if (!statsRes.ok || !gamesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [statsData, gamesData] = await Promise.all([
                    statsRes.json(),
                    gamesRes.json()
                ]);

                setStatistics(statsData);
                setGames(gamesData);

                // Check if there's a next round by trying to fetch its data
                const nextRoundRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/round/${parseInt(roundId) + 1}/statistics`);
                setHasNextRound(nextRoundRes.ok);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (tourneyId && roundId) {
            fetchData();
        }
    }, [tourneyId, roundId]);

    const handleNavigation = (direction) => {
        const newRoundId = parseInt(roundId) + direction;
        router.push(`/tourneys/${tourneyId}/round/${newRoundId}`);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!statistics || !games.length) {
        return <div>No se encontraron datos.</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4"> Ronda {roundId}</h1>
            <div className="d-flex justify-content-between mb-4">
                {hasPreviousRound && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleNavigation(-1)}
                    >
                        Ronda Anterior
                    </button>
                )}
                {hasNextRound && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleNavigation(1)}
                    >
                        Siguiente Ronda
                    </button>
                )}
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Posición</th>
                    <th scope="col">Team</th>
                    <th scope="col">played</th>
                    <th scope="col">points</th>
                    <th scope="col">won</th>
                    <th scope="col">draw</th>
                    <th scope="col">lost</th>
                    <th scope="col">GF</th>
                    <th scope="col">GA</th>
                    <th scope="col">diff</th>
                    <th scope="col">perf</th>
                </tr>
                </thead>
                <tbody>
                {statistics.map((stat, index) => (
                    <tr key={index} className={stat.status === 'champ' ? 'table-success' : stat.status === 'elim' ? 'table-danger' : 'table-primary'}>
                        <th scope="row">{index + 1}</th>
                        <td>
                            <Link href={`/tourneys/${tourneyId}/team/${stat.team_id}`}>
                                {stat.team_name}
                            </Link>
                        </td>
                        <td>{stat.played}</td>
                        <td><b>{stat.points}</b></td>
                        <td>{stat.won}</td>
                        <td>{stat.draw}</td>
                        <td>{stat.lost}</td>
                        <td>{stat.gf}</td>
                        <td>{stat.ga}</td>
                        <td>{stat.diff}</td>
                        <td>{stat.perf}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h1 className="text-center mb-4">Juegos de la Ronda {roundId}</h1>
            <ul className="list-group">
                {games.map((game, index) => (
                    <li key={index} className="list-group-item">
                        {Object.keys(game)[0]} {game[Object.keys(game)[0]]} - {Object.keys(game)[1]} {game[Object.keys(game)[1]]}
                    </li>
                ))}
            </ul>
        </div>
    );
}
