"use client";

import { useState, useEffect } from 'react';
import {useParams, useRouter} from 'next/navigation';
import {fetchTourneyConfederationsTeams, addTourneyTeams} from '@/app/lib/api';

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
    const [confederations, setConfederations] = useState<Confederation[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [teamCount, setTeamCount] = useState(0);
    const router = useRouter();
    const { tourneyId } = useParams();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await fetchTourneyConfederationsTeams(tourneyId);
                setConfederations(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedTeams(selectedOptions);
        setTeamCount(selectedOptions.length);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tournamentData = { team_ids: selectedTeams };

        try {
            /*const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/add-teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tournamentData)
            });

            if (response.ok) {
                router.push(`/tourneys/${tourneyId}/teams`);
            } else {
                console.error('Failed to create tournament');
            }*/

            await addTourneyTeams(tourneyId, tournamentData);
            router.push(`/tourneys/${tourneyId}/teams`);


        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Add teams in the tournament</h1>
            <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="teams" className="form-label">Select Teams</label>
                    <select id="teams" multiple value={selectedTeams} onChange={handleTeamChange}
                            className="form-select large-select" size="10" required>
                        {confederations.map((confederation) => (
                            <optgroup key={confederation.id} label={confederation.name}>
                                {confederation.teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <small className="form-text text-muted">{teamCount} team(s) selected</small>
                </div>
                <button type="submit" className="btn btn-primary w-100">Add Team</button>
            </form>
        </div>
    );
}
