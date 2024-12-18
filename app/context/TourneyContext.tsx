// context/TourneyContext.js
"use client"; // Marca este componente como un Client Component

import { createContext, useContext, useState, useEffect } from 'react';
import {fetchTourney} from "@/app/lib/api";

const TourneyContext = createContext();

export function TourneyProvider({ children, tourneyId }) {
    const [tourneyName, setTourneyName] = useState('');
    const [tourneyGroupsSystem, setTourneyGroupsSystem] = useState(false);
    const [tourneyLeagueSystem, setTourneyLeagueSystem] = useState(false);
    const [tourneyStarted, setTourneyStarted] = useState(false);
    const [tourneyHasFixture, setTourneyHasFixture] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTourneyDetails() {
            try {
                /*const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tournament details');
                }
                const data = await response.json();
                */
                console.log('tourneyId');
                console.log(tourneyId);
                const data = await fetchTourney(tourneyId);

                setTourneyName(data.name);
                setTourneyGroupsSystem(data.groups);
                setTourneyLeagueSystem(data.league);
                setTourneyStarted(data.started);
                setTourneyHasFixture(data.fixture);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (tourneyId) {
            fetchTourneyDetails();
        }
    }, [tourneyId]);

    return (
        <TourneyContext.Provider value={{ tourneyName, setTourneyName, tourneyGroupsSystem, setTourneyGroupsSystem, tourneyLeagueSystem, setTourneyLeagueSystem, tourneyStarted, setTourneyStarted, tourneyHasFixture, setTourneyHasFixture, loading, error }}>
            {children}
        </TourneyContext.Provider>
    );
}

export function useTourney() {
    return useContext(TourneyContext);
}
