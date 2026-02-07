'use client';

import { useState } from "react";
import api from "../../src/utils/api";

// Define the expected response shape

interface CreateEntityResponse {
  success: boolean;
  entity: {
    name: string;
    type: string;
  };
  message: string;
}
interface EntityFormProps {
  onSuccess: () => void;
}

const EntityForm = ({ onSuccess }: EntityFormProps) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !type) {
        setMessage("all fields are required");
        return;
        }

        try {
            // Tell Axios what type to expect
            const response = await api.post<CreateEntityResponse>("/entities", { name, type });

            setMessage(`Entity "${response.data.entity.name}" created successfully!`);
            setName("");
            setType("");
            onSuccess();
        } 
        catch (err: any) {
            console.error(err);
            setMessage(err?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                display: "block",
                marginBottom: "15px",
                padding: "12px 16px",
                fontSize: "18px",
                width: "300px",
                borderRadius: "8px",
                }}
            />
            <input
                type="text"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                display: "block",
                marginBottom: "15px",
                padding: "12px 16px",
                fontSize: "18px",
                width: "300px",
                borderRadius: "8px",
                }}
            />
            <button type="submit"
            style={{
                padding: "14px 20px",
                fontSize: "18px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
            }}>Create Entity</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default EntityForm;