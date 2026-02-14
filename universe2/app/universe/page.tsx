'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { Engine } from "../../src/engine/Engine.js";
import Button from '../utils/Button';

export default function Universe() 
{
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new Engine(containerRef.current, { fps: 60 });
    engineRef.current = engine;
    engine.Start();

    return () => {
      engine?.Dispose();
      engineRef.current = null;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          fontSize: "1.4rem",
        }}
      >
        <Button
          title="Back to Landing Page"
          mainClassName="bg-[#1e5a8a] hover:bg-[#3b7db5] py-4 rounded"
          titleClassName="text-2xl font-bold uppercase"
          onClick={() => router.push('/')}
        />
        <button onClick={() => engineRef.current?.gameControls.controls.lock()}
          style={{
            padding: "10px 12px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}>
          🔒 Lock In
        </button>
        <label>
          Time Scale
          <input
            type="range"
            min="1"
            max="1000"
            value={timeScale}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTimeScale(val);
              engineRef.current?.SetTimeScale(val);
            }}
            style={{ width: "240px", height: "16px" }}
          />
        </label>
      </div>
    </div>
  );
}