'use client';

import { useState } from "react";
import api from "../../src/utils/api";

// Define the expected response shape
interface CreateObjectResponse {
  success: boolean;
  object: {
    key: string;
    name: string;
    type: string;
  };
  message: string;
}

export default function Helper() {
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!key || !name || !type) {
      setMessage("all fields are required");
      return;
    }

    try {
      // Tell Axios what type to expect
      const response = await api.post<CreateObjectResponse>("/objects", { key, name, type });

      setMessage(`Object "${response.data.object.name}" created successfully!`);
      setKey("");
      setName("");
      setType("");
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{
      padding: "40px",          // bigger outer space
      maxWidth: "400px",        // constrain width
      margin: "50px auto",      // center horizontally
      border: "2px solid #ccc", // optional: visual border
      borderRadius: "12px",     // rounded corners
      backgroundColor: "#2e484f",  // optional: dark background
      color: "white",
    }}>
      <h1>Create Object</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{
            display: "block",
            marginBottom: "15px",
            padding: "12px 16px",  // more space inside
            fontSize: "18px",      // bigger text
            width: "300px",        // wider
            borderRadius: "8px",   // slightly rounded corners
          }}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            display: "block",
            marginBottom: "15px",
            padding: "12px 16px",  // more space inside
            fontSize: "18px",      // bigger text
            width: "300px",        // wider
            borderRadius: "8px",   // slightly rounded corners
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
            padding: "12px 16px",  // more space inside
            fontSize: "18px",      // bigger text
            width: "300px",        // wider
            borderRadius: "8px",   // slightly rounded corners
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
        }}>Create Object</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
