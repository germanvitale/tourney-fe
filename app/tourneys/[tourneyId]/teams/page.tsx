"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaTrashAlt } from "react-icons/fa";
import {useTourney} from "../../../context/TourneyContext";
import {fetchTourneyTeams, removeTourneyTeam} from "@/app/lib/api";

export default function TourneyTeams() {
    const { tourneyId } = useParams();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const { tourneyStarted } = useTourney();
    const { tourneyHasFixture } = useTourney();

    useEffect(() => {
        getTeams();
    }, [tourneyId]);

    const getTeams = async () => {
        setLoading(true);
        try {
            const data = await fetchTourneyTeams(tourneyId);

            setTeams(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeTeam = async (teamId) => {
        try {
           /* const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/team/${teamId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove team');
            }*/

            await removeTourneyTeam(tourneyId, teamId);

            // Actualizar la lista de equipos después de eliminar
            setTeams(teams.filter(team => team.id !== teamId));
            setSuccessMessage('Team removed successfully!');
            setError(null);
        } catch (error) {
            console.error('Error removing team:', error);
            setError(error.message);
            setSuccessMessage(null);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}

            {
                !tourneyHasFixture && (
                    <Link href={`/tourneys/${tourneyId}/teams/add`}>
                        <button className="btn btn-primary mb-3">
                            Add Teams
                        </button>
                    </Link>
                )
            }

            <ul>
                {teams.map((team) => (
                    <li key={team.id}>
                        {team.name}

                        {
                            !tourneyHasFixture && (
                                <button
                                    className="btn"
                                    onClick={() => removeTeam(team.id)}
                                >
                                    <FaTrashAlt/>
                                </button>
                            )
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}
