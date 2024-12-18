// tourneys/[tourneyId]/games/[gameId]/page.js
"use client"; // Marca este componente como un Client Component

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {useTourney} from "../../../../context/TourneyContext";
import { fetchGame, setGameResults } from "@/app/lib/api";

export default function GameDetails() {
    const { tourneyId, gameId } = useParams(); // Obtener tourneyId y gameId de los parámetros de la URL
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [goalsLocal, setGoalsLocal] = useState(0);
    const [goalsVisit, setGoalsVisit] = useState(0);

    const {tourneyStarted, setTourneyStarted} = useTourney();

    useEffect(() => {
        async function getGame() {
            try {
                /*const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game details');
                }
                const data = await response.json();*/


                const data = await fetchGame(gameId);



                setGame(data);
                setGoalsLocal(data.goals_local || 0);
                setGoalsVisit(data.goals_visit || 0);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (gameId) {
            getGame();
        }
    }, [gameId]);

    const handleSaveGame = async () => {
        try {

/*
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/set-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    game_id: gameId,
                    goals_local: goalsLocal,
                    goals_visit: goalsVisit,
                    random: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save game');
            }

            const updatedGame = await response.json();
*/

            const data = {
                game_id: gameId,
                goals_local: goalsLocal,
                goals_visit: goalsVisit,
                random: false,
            };
            const updatedGame = await setGameResults(data);

            setGame(updatedGame);
            setEditing(false);

            setTourneyStarted(true);

        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            {game ? (
                <div className="mt-4">

                    {editing ? (
                        <div>
                            <div className="form-group" style={{display: 'flex', alignItems: 'center'}}>
                                <p style={{marginRight: '8px'}}><strong>{game.local_team}</strong></p>
                                <input
                                    type="number"
                                    value={goalsLocal}
                                    onChange={(e) => setGoalsLocal(Math.max(0, e.target.value))}
                                    className="form-control"
                                    style={{width: '60px', marginRight: '8px'}}
                                />
                                <span style={{margin: '0 8px'}}> - </span>
                                <input
                                    type="number"
                                    value={goalsVisit}
                                    onChange={(e) => setGoalsVisit(Math.max(0, e.target.value))}
                                    className="form-control"
                                    style={{width: '60px', marginLeft: '8px'}}
                                />
                                <p style={{marginLeft: '8px'}}><strong>{game.visit_team}</strong></p>
                            </div>

                                <button className="btn btn-success mt-3" onClick={handleSaveGame}>
                                    Save
                                </button>
                            </div>
                            ) : (

                        <div>


                            <div className="form-group" style={{display: 'flex', alignItems: 'center'}}>
                                <p style={{marginRight: '8px'}}><strong>{game.local_team}</strong></p>
                                {goalsLocal}
                                <span style={{margin: '0 8px'}}> - </span> {goalsVisit}
                                <p style={{marginLeft: '8px'}}><strong>{game.visit_team}</strong></p>
                            </div>


                            <button className="btn btn-primary mt-3" onClick={() => setEditing(true)}>
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>No game details found.</p>
            )}
        </div>
    );
}
