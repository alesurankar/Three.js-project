'use client';

import { useState } from "react";

export default function Helper() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !name) {
      setMessage("Both fields are required");
      return;
    }

    try {
      const res = await fetch("/api/objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Object "${data.name}" created successfully!`);
        setId("");
        setName("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Object</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <button type="submit">Create Object</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
