import { apiClient } from './apiClient';

// Auth
export async function login(data) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to login');
    const responseJson = await response.json();

    localStorage.setItem('accessToken', responseJson.token);
}

// Tourney
export async function fetchTourneys() {
    return apiClient('/api/tourneys');
}

export async function fetchTourney(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}`);
}

export async function createTourney(data) {
    return apiClient('/api/tourneys', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function fetchTourneyTeams(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/teams`);
}

export async function addTourneyTeams(tourneyId, data) {
    return apiClient(`/api/tourney/${tourneyId}/add-teams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export async function removeTourneyTeam(tourneyId, teamId) {
    return apiClient(`/api/tourney/${tourneyId}/team/${teamId}`, {
        method: 'DELETE'
    });
}

export async function fetchTourneyConfederationsTeams(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/confederations/teams`);
}

export async function fetchStatistics(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/statistics`);
}




// Fixture
export async function fetchFixture(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/fixture`);
}

export async function createFixture(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/fixture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function removeFixture(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/fixture`, {
        method: 'DELETE'
    });
}

export async function fetchTeams() {
    return apiClient('/api/teams/');
}

export async function createTeam(data) {
    return apiClient('/api/teams/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function fetchConfederations() {
    return apiClient('/api/confederations/');
}

export async function fetchConfederationsTeams() {
    return apiClient('/api/confederations/teams/');
}

export async function fetchGroupAvailableTeams(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/groups-teams`, );
}

export async function fetchFirstStageGroups(tourneyId) {
    return apiClient(`/api/tourney/${tourneyId}/first-stage-groups`);
}

export async function updateStage(stageId, data) {
    return apiClient(`/api/stage/${stageId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function createGroup(tourneyId, data) {
    return apiClient(`/api/tourney/${tourneyId}/group`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function addGroupTeam(groupId, selectedTeams) {
    return apiClient(`/api/group/${groupId}/teams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            team_ids: selectedTeams,
        }),
    });
}

export async function removeGroup(groupId) {
    return apiClient(`/api/group/${groupId}`, {
        method: "DELETE"
    });
}

export async function removeGroupTeam(groupId, teamId) {
    return apiClient(`/api/group/${groupId}/team/${teamId}`, {
        method: "DELETE"
    });
}

// Game
export async function fetchGame(gameId) {
    return apiClient(`/api/games/${gameId}`);
}

export async function setGameResults(data) {
    return apiClient(`/api/set-game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
