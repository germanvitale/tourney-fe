"use client"; // Marca este componente como un Client Component

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TeamDetails() {
    const { tourneyId, teamId } = useParams();
    const [games, setGames] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchGames() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/team/${teamId}/games`);
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await res.json();
                setGames(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        async function fetchStatistics() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/team/${teamId}/statistics`);
                if (!res.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                const data = await res.json();
                setStatistics(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (tourneyId && teamId) {
            fetchGames();
            fetchStatistics();
        }
    }, [tourneyId, teamId]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mt-1">
            {statistics && (
                <>
                    <div className="mt-5">
                        <h2 className="text-center mb-4">{statistics.team_name}</h2>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Jugados</th>
                                <th scope="col">Ganados</th>
                                <th scope="col">Perdidos</th>
                                <th scope="col">Empatados</th>
                                <th scope="col">GF</th>
                                <th scope="col">GA</th>
                                <th scope="col">Diferencia</th>
                                <th scope="col">Puntos</th>
                                <th scope="col">Rendimiento</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{statistics.played}</td>
                                <td>{statistics.won}</td>
                                <td>{statistics.lost}</td>
                                <td>{statistics.draw}</td>
                                <td>{statistics.gf}</td>
                                <td>{statistics.ga}</td>
                                <td>{statistics.diff}</td>
                                <td>{statistics.points}</td>
                                <td>{statistics.perf}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <h1 className="text-center mb-4">Games</h1>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col" style={{width: "25%"}}>Local</th>
                            <th scope="col" style={{width: "25%"}}></th>
                            <th scope="col" style={{width: "25%"}}>Visitante</th>
                            <th scope="col" style={{width: "25%"}}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map((game, index) => (
                            <tr key={index} className={game.result === 'won' ? 'table-success' : game.result === 'lost' ? 'table-danger' : 'table-warning'}>
                                <td className={game.local_team === statistics.team_name ? 'fw-bold' : ''}>{game.local_team}</td>
                                <td>{game.goals_local}</td>
                                <td className={game.visit_team === statistics.team_name ? 'fw-bold' : ''}>{game.visit_team}</td>
                                <td>{game.goals_visit}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
