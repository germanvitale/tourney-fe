// components/TournamentMenu.js
"use client"; // Marca este componente como un Client Component

import Link from 'next/link';
import { useTourney } from './../context/TourneyContext'; // Ajusta la ruta si es necesario

export default function TournamentMenu({ tourneyId }) {
    const { tourneyName, tourneyGroupsSystem, tourneyLeagueSystem, loading, error } = useTourney();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="text-center">
            <h1>{tourneyName}</h1>
            <nav className="menu">
                <Link href={`/tourneys/${tourneyId}/teams`}>
                    <button className="btn btn-outline-primary m-2">Teams</button>
                </Link>
                {
                    tourneyGroupsSystem && (
                        <Link href={`/tourneys/${tourneyId}/groups`}>
                            <button className="btn btn-outline-primary m-2">Groups</button>
                        </Link>
                    )
                }

                <Link href={`/tourneys/${tourneyId}/fixture`}>
                    <button className="btn btn-outline-primary m-2">Fixture</button>
                </Link>

                {
                    tourneyLeagueSystem && (
                        <Link href={`/tourneys/${tourneyId}/table`}>
                            <button className="btn btn-outline-primary m-2">Table</button>
                        </Link>
                    )
                }

                {/*
                    <Link href={`/tourneys/${tourneyId}/stats`}>
                    <button className="btn btn-outline-primary m-2">Statistics</button>
                </Link>
                <Link href={`/tourneys/${tourneyId}/round/1`}>
                    <button className="btn btn-outline-primary m-2">Round by Round</button>
                </Link>
                */}
            </nav>
        </div>
    );
}
