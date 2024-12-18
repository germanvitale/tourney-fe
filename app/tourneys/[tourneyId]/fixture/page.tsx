"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {useTourney} from "../../../context/TourneyContext";
import {fetchFixture, createFixture, removeFixture, updateStage} from '@/app/lib/api';

export default function TourneyFixture() {
    const { tourneyId } = useParams();
    const [fixture, setFixture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creatingFixture, setCreatingFixture] = useState(false);
    const [removingFixture, setRemovingFixture] = useState(false);
    const {tourneyStarted, setTourneyHasFixture} = useTourney();
    const [selectedQualifiedTeam, setSelectedQualifiedTeam] = useState(""); // Selected qualified team
    const [qualifiedOptions, setQualifiedOptions] = useState([]); // Almacenar las opciones de equipos calificados
    const [firstGroupsStageId, setFirstGroupsStageId] = useState(0); // Almacenar las opciones de equipos calificados

    // Mover getFixture fuera del useEffect para que esté disponible globalmente
    const getFixture = async () => {
        try {
            /*const fixtureRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/fixture`);

            if (!fixtureRes.ok) {
                throw new Error('Failed to fetch fixture');
            }

            const fixtureData = await fixtureRes.json();*/

            const data = await fetchFixture(tourneyId);

            setFixture(data.fixture);
            setQualifiedOptions(data.fixture.qualifiedOptions); // Guardar las opciones de equipos calificados
            setFirstGroupsStageId(data.fixture.firstGroupsStageId); // en caso de que haya groupKnockout, guardarlo
            setSelectedQualifiedTeam(data.fixture.qualifiedOptionsSelected); // en caso de que haya groupKnockout, guardarlo
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tourneyId) {
            getFixture();
        }
    }, [tourneyId]);

    const handleCreateFixture = async () => {
        setCreatingFixture(true);
        try {
            /*
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/fixture`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to create fixture');
            }
             */

            await createFixture(tourneyId);


            setTourneyHasFixture(true);
            await getFixture();
        } catch (error) {
            setError(error.message);
        } finally {
            setCreatingFixture(false);
        }
    };

    const handleRemoveFixture = async () => {
        setRemovingFixture(true);
        try {
           /* const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/fixture`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove fixture');
            }*/


            removeFixture(tourneyId);


            await getFixture();
        } catch (error) {
            setError(error.message);
        } finally {
            setRemovingFixture(false);
        }
    };

    const handleQualifiedTeamChange = async (e) => {

        const selectedValue = e.target.value;

        setSelectedQualifiedTeam(selectedValue);

        try
        {
            const data = { qualified_teams: selectedValue };
            await updateStage(firstGroupsStageId, data);

           /* const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stage/${firstGroupsStageId}?qualified_teams=${selectedValue}`, {
                method: "PUT",
            });

            if (response.ok) {
                alert("Qualified team updated successfully!");
            } else {
                alert("Error updating qualified team.");
            }*/



        } catch (error) {
            console.error("Error updating qualified team:", error);
        }
    };

    if (loading || creatingFixture || removingFixture) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!fixture.hasGames) {
        return (
            <div className="container">

                {fixture.groupKnockout && (
                        <div>
                            <h2>Knockout Stage</h2>
                            <select
                                value={selectedQualifiedTeam}
                                onChange={handleQualifiedTeamChange}
                                style={{
                                    padding: "10px",
                                    marginBottom: "20px",
                                    backgroundColor: "#0070f3",
                                    color: "#fff",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <option disabled selected value> Select an option</option>
                                {qualifiedOptions.map((option) => (
                                    <option key={option.teams} value={option.teams}>
                                        {option.stage_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )
                }

                {!fixture.emptyGroups ? (
                    <div className="row">
                        <div className="col-8">
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateFixture}
                                disabled={creatingFixture}
                            >
                                {creatingFixture ? 'Creating Fixture...' : 'Create Fixture'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-warning" role="alert">
                        There are empty groups in the tourney
                    </div>
                )
                }

            </div>
        );
    }

    return (
        <div className="container py-4">
        <div className="row justify-content-center">
                <div className="col-10">

                    {fixture.groups && (
                        <div className="stage-container mb-4">
                            <h3 className="stage-title">Group Stage</h3>
                            {Object.keys(fixture.groups).map(groupName => (
                                <div key={groupName} className="group-box mb-3 p-3">
                                    <h4 className="group-title">Group {groupName}</h4>
                                    <p className="group-teams">Teams: {fixture.groups[groupName].teams.map(team => team.name).join(', ')}</p>
                                    {Object.keys(fixture.groups[groupName].games).map(round => (
                                        <div key={round} className="round-box mb-2">
                                            <h5 className="round-title">Round {round}</h5>
                                            <ul className="game-list">
                                                {fixture.groups[groupName].games[round].map((game, index) => (
                                                    <li key={index} className="game-item">
                                                        <Link href={`/tourneys/${tourneyId}/games/${game.game_id}`}>
                                                            {Object.keys(game)[1]} {game[Object.keys(game)[1]]} - {Object.keys(game)[2]} {game[Object.keys(game)[2]]}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {fixture.league && (
                        <div className="stage-container mb-4">
                            <h3 className="stage-title">League Stage</h3>
                            {Object.keys(fixture.league).map(round => (
                                <div key={round} className="round-box mb-2 p-2">
                                    <h4 className="round-title">Round {round}</h4>
                                    <ul className="game-list">
                                        {fixture.league[round].map((game, index) => (
                                            <li key={index} className="game-item">
                                                <Link href={`/tourneys/${tourneyId}/games/${game.game_id}`}>
                                                    {Object.keys(game)[1]} {game[Object.keys(game)[1]]} - {Object.keys(game)[2]} {game[Object.keys(game)[2]]}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {fixture.knockout && (
                        <div className="stage-container mb-4">
                            <h3 className="stage-title">Knockout Stage</h3>
                            <div className="row">
                                {Object.entries(fixture.knockout).map(([round, roundGames], index) => (
                                    <div className={`col-${12 / Object.keys(fixture.knockout).length}`} key={round}>
                                        <h4 className="round-title">Round {round}</h4>
                                        <ul className="game-list">
                                            {roundGames.map((game, gameIndex) => (
                                                <li key={gameIndex} className="game-item">
                                                    <Link href={`/tourneys/${tourneyId}/games/${game.game_id}`}>
                                                        {Object.keys(game)[1]} {game[Object.keys(game)[1]]} - {Object.keys(game)[2]} {game[Object.keys(game)[2]]}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {
                        !tourneyStarted && (
                            <button
                                className="btn btn-danger mt-3"
                                onClick={handleRemoveFixture}
                                disabled={removingFixture}
                            >
                                {removingFixture ? 'Removing Fixture...' : 'Remove Fixture'}
                            </button>
                        )
                    }

                </div>
            </div>
        </div>
    );

}
