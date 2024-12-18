"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {useTourney} from "../../../context/TourneyContext";
import Link from "next/link";
import {FaTrashAlt} from "react-icons/fa";
import {
    addGroupTeam,
    fetchFirstStageGroups,
    fetchGroupAvailableTeams,
    fetchTourneys,
    removeGroupTeam,
    removeGroup
} from "@/app/lib/api";

export default function Groups() {
    const [groupsData, setGroupsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availableTeams, setAvailableTeams] = useState([]); // Teams available to add
    const [selectedGroupId, setSelectedGroupId] = useState(null); // Group selected to add teams
    const [selectedTeams, setSelectedTeams] = useState([]); // Teams selected in the modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const { tourneyId } = useParams(); // Get tourneyId from URL
    const [stageId, setStageId] = useState(null);
    const { tourneyHasFixture } = useTourney();

    useEffect(() => {
        if (!tourneyId) return;

        const getFirstStageGroups = async () => {
            try {
                const data = await fetchFirstStageGroups(tourneyId);

                setStageId(data.id); // Establecer el stageId
                setGroupsData(data.groups); // Guardar los grupos
                setLoading(false);
            } catch (error) {
                console.error("Error fetching groups data:", error);
            } finally {
                setLoading(false);
            }
        }

        getFirstStageGroups();
      /*
        // Fetch groups data
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/first-stage-groups`)
            .then((response) => response.json())
            .then((data) => {
                setStageId(data.id); // Establecer el stageId
                setGroupsData(data.groups); // Guardar los grupos
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching groups data:", error);
                setLoading(false);
            });*/
    }, [tourneyId]);

    const handleAddTeamClick = async (groupId) => {
        setSelectedGroupId(groupId);
        setIsModalOpen(true);

        // Fetch available teams for the group
      //  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/groups-teams`);
      //  const data = await response.json();


        const data = await fetchGroupAvailableTeams(tourneyId);


        setAvailableTeams(data);
    };

    const handleTeamSelection = (teamId) => {
        if (selectedTeams.includes(teamId)) {
            setSelectedTeams(selectedTeams.filter((id) => id !== teamId)); // Unselect if already selected
        } else {
            setSelectedTeams([...selectedTeams, teamId]); // Add if not selected
        }
    };

    // Function to add selected teams to the group
    const handleAddTeamsToGroup = async () => {
        try {

            await addGroupTeam(selectedGroupId, selectedTeams);

            const updatedGroups = groupsData.map((group) => {
                if (group.id === selectedGroupId) {
                    const newTeams = availableTeams.filter((team) => selectedTeams.includes(team.id));
                    return {
                        ...group,
                        teams: [...group.teams, ...newTeams],
                    };
                }
                return group;
            });

            setGroupsData(updatedGroups);
            setIsModalOpen(false);
            setSelectedTeams([]);


           /* const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/group/${selectedGroupId}/teams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    team_ids: selectedTeams,
                }),
            });

            if (response.ok) {
                // Update local state to reflect the added teams
                const updatedGroups = groupsData.map((group) => {
                    if (group.id === selectedGroupId) {
                        const newTeams = availableTeams.filter((team) => selectedTeams.includes(team.id));
                        return {
                            ...group,
                            teams: [...group.teams, ...newTeams],
                        };
                    }
                    return group;
                });

                setGroupsData(updatedGroups);
                setIsModalOpen(false);
                setSelectedTeams([]);
            } else {
                alert("Error adding teams.");
            }*/
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the teams.");
        }
    };

    // Function to remove team from the group
    const handleRemoveTeam = async (groupId, teamId) => {
        try {
            await removeGroupTeam(groupId, teamId);
            // Update local state to remove the team
            const updatedGroups = groupsData.map((group) => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        teams: group.teams.filter((team) => team.id !== teamId),
                    };
                }
                return group;
            });

            setGroupsData(updatedGroups);

            /*
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/group/${groupId}/team/${teamId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Update local state to remove the team
                const updatedGroups = groupsData.map((group) => {
                    if (group.id === groupId) {
                        return {
                            ...group,
                            teams: group.teams.filter((team) => team.id !== teamId),
                        };
                    }
                    return group;
                });

                setGroupsData(updatedGroups);
            } else {
                alert("Error removing team.");
            }*/
        } catch (error) {
            console.error("Error removing team:", error);
            alert("An error occurred while removing the team.");
        }
    };

    const handleRemoveGroup = async (groupId) => {
        try {
            await removeGroup(groupId);
            const updatedGroups = groupsData.filter((group) => group.id !== groupId);
            setGroupsData(updatedGroups);

/*
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/group/${groupId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Update the local state by filtering out the removed group
                const updatedGroups = groupsData.filter((group) => group.id !== groupId);
                setGroupsData(updatedGroups);
            } else {
                alert("Error removing group.");
            }*/
        } catch (error) {
            console.error("Error removing group:", error);
            alert("An error occurred while removing the group.");
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!groupsData) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <h1>Groups Stage</h1>


            {
                !tourneyHasFixture && (
                <div>
                    <Link href={`/tourneys/${tourneyId}/groups/add`}>
                    <button style={{
                        padding: "10px 20px",
                        marginBottom: "20px",
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer"
                    }}>
                        Add Group
                    </button>
                </Link>
             </div>
    )
}

            {
                tourneyHasFixture ? (
                    // Acción cuando es true
                    <div>
                        {
                            groupsData.map((group) => (
                                <div key={group.id}
                                     style={{
                                         marginBottom: "20px",
                                         border: "1px solid #ccc",
                                         padding: "10px",
                                         borderRadius: "8px"
                                     }}>

                                    <h2>{group.name}</h2>

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
                                        {group.teams.map((team) => (
                                            <tr>
                                                <th scope="row">{team.name}</th>
                                                <td>{team.pivot.played}</td>
                                                <td><b>{team.pivot.points}</b></td>
                                                <td>{team.pivot.won}</td>
                                                <td>{team.pivot.draw}</td>
                                                <td>{team.pivot.lost}</td>
                                                <td>{team.pivot.gf}</td>
                                                <td>{team.pivot.ga}</td>
                                                <td>{team.pivot.diff}</td>
                                                <td>{team.pivot.perf}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                    </div>
                ) : (
                    // Acción cuando es false
                    <div>
                        {
                            groupsData.map((group) => (
                                <div key={group.id}
                                     style={{
                                         marginBottom: "20px",
                                         border: "1px solid #ccc",
                                         padding: "10px",
                                         borderRadius: "8px"
                                     }}>
                                    <h2><strong>{group.name}</strong>
                                        <button
                                            onClick={() => handleRemoveGroup(group.id)}
                                        >
                                            <FaTrashAlt/>
                                        </button>
                                    </h2>


                                    <ul style={{listStyleType: "none", padding: 0}}>
                                        {group.teams.map((team) => (
                                            <li key={team.id} style={{
                                                marginBottom: "5px",
                                                padding: "5px 0",
                                                borderBottom: "1px solid #eee",
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}>
                                                <h3>{team.name}</h3>
                                                <button
                                                    onClick={() => handleRemoveTeam(group.id, team.id)}
                                                    style={{
                                                        padding: "5px 10px",
                                                    }}
                                                >
                                                    <FaTrashAlt/>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleAddTeamClick(group.id)}
                                        style={{
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                        }}
                                        className="btn btn-primary mb-3"
                                    >
                                        Add Teams
                                    </button>
                                </div>
                            ))}

                        {/* Modal to add teams */}
                        {isModalOpen && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            padding: "20px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            zIndex: 1000,
                        }}
                    >
                        <h2>Select Teams to Add</h2>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {availableTeams.map((team) => (
                                <li key={team.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedTeams.includes(team.id)}
                                            onChange={() => handleTeamSelection(team.id)}
                                        />
                                        {team.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleAddTeamsToGroup}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#0070f3",
                                color: "#fff",
                                borderRadius: "5px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Add Selected Teams
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "gray",
                                color: "#fff",
                                borderRadius: "5px",
                                border: "none",
                                marginLeft: "10px",
                                cursor: "pointer",
                            }}
                        >
                            Close
                        </button>
                    </div>
                )}
                    </div>
                )
            }
        </div>
    );
}



