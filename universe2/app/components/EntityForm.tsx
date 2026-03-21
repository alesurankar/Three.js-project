'use client';

import { useState } from "react";
import Button from "@/app//utils/Button";
import api from "@/engine/utils/api";

interface CreateEntityResponse {
  success: boolean;
  entity: {
    key: string,
    name: string;
    type: string;
    parentKey: string,
    systemKey: string;
    galaxyKey: string;
  };
  message: string;
}

interface EntityFormProps {
  type: "star" | "planet";
  onSuccess: () => void;
}

const EntityForm = ({ type, onSuccess }: EntityFormProps) => {
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [parentKey, setParentKey] = useState("");
  const [systemKey, setSystemKey] = useState("");
  const [galaxyKey, setGalaxyKey] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!key || !name || !parentKey || !systemKey || !galaxyKey) {
        setMessage("all fields are required");
        return;
      }

      try {
        const { data } = await api.post<CreateEntityResponse>("/entities", 
          { key, name, type, parentKey, systemKey, galaxyKey });

        setMessage(`Entity "${data.entity.name}" created successfully!`);
        setKey("");
        setName("");
        setParentKey("");
        setSystemKey("");
        setGalaxyKey("");
        if (onSuccess) onSuccess();
      } 
      catch (err: any) {
        console.error(err);
        setMessage(err?.response?.data?.message || "Something went wrong");
      }
  };
  const title = type === "star" ? "Add a Star" : "Add a Planet";

  return (
    <div className="rounded-xl w-full max-w-4xl bg-white grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
      {/* LEFT PANEL */}
      <div className="bg-black flex items-center justify-center p-4 h-full">
        <div className="text-white font-bold text-xl text-center">
          {type === "star"
            ? "Create a star"
            : "Create a planet"}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-[#4a5748] py-6 lg:py-12 px-10 lg:px-12 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="text-center">
          <h2 className="text-black text-xl lg:text-4xl mb-4 lg:mb-8">{title}</h2>
          
          <input
            type="text"
            placeholder="Key (lower_case)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            className="mb-1 w-full max-w-sm border rounded px-2 lg:px-3 py-0 lg:py-2 placeholder:text-sm lg:placeholder:text-lg"
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mb-1 w-full max-w-sm border rounded px-2 lg:px-3 py-0 lg:py-2 placeholder:text-sm lg:placeholder:text-lg"
          />
          <input
            type="text"
            placeholder="Parent Key (lower_case)"
            value={parentKey}
            onChange={(e) => setParentKey(e.target.value)}
            required
            className="mb-1 w-full max-w-sm border rounded px-2 lg:px-3 py-0 lg:py-2 placeholder:text-sm lg:placeholder:text-lg"
          />
          <input
            type="text"
            placeholder="System Key (lower_case)"
            value={systemKey}
            onChange={(e) => setSystemKey(e.target.value)}
            required
            className="mb-1 w-full max-w-sm border rounded px-2 lg:px-3 py-0 lg:py-2 placeholder:text-sm lg:placeholder:text-lg"
          />
          <input
            type="text"
            placeholder="Galaxy Key (lower_case)"
            value={galaxyKey}
            onChange={(e) => setGalaxyKey(e.target.value)}
            required
            className="mb-1 w-full max-w-sm border rounded px-2 lg:px-3 py-0 lg:py-2 placeholder:text-sm lg:placeholder:text-lg"
          />

          <div className="flex justify-center mt-4 -mb-2">
            <Button
              type="submit"
              title="Create"
              mainClassName="bg-[#7c2923] hover:bg-[#d5453a] px-6 py-2 rounded-lg"
              titleClassName="text-black font-bold"
            />
          </div>

          {message && (
            <p className="mt-4 text-white font-semibold">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EntityForm;