"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {createGroup} from "@/app/lib/api";
export default function AddGroup() {
    const [groupName, setGroupName] = useState("");
    const router = useRouter();
    const { tourneyId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupName) {
            alert("Please enter a group name");
            return;
        }

        try {
            const groupData = { name: groupName };

            await createGroup(tourneyId, groupData);
            router.push(`/tourneys/${tourneyId}/groups`); // Redirigir a la página de grupos después de crear el grupo

           /* const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tourney/${tourneyId}/group?name=${groupName}`, {
                method: "POST",
            });

            if (response.ok) {
                router.push(`/tourneys/${tourneyId}/groups`); // Redirigir a la página de grupos después de crear el grupo
            } else {
                alert("Error creating group.");
            }*/
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the group.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="group-name">Name</label>
                    <br />
                    <input
                        id="group-name"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary mb-3" type="submit">Create</button>
            </form>
        </div>
    );
}
