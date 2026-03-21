'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { Engine } from "@/engine/Engine.js";


export default function Universe() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [timeScale, setTimeScale] = useState(1);
  const [currentSceneName, setCurrentSceneName] = useState("None");

  useEffect(() => {
    if (!containerRef.current) return;
    if (engineRef.current) return;

    let disposed = false;

    const initEngine = async () => {
      const engine = new Engine(containerRef.current!, { fps: 60 });

      engine.manager.onSceneChange = (sceneName: string) => {
        if (!disposed) {
          setCurrentSceneName(sceneName);
        }
      };

      engineRef.current = engine;
      await engine.Start();
    };
    initEngine();

    return () => {
      disposed = true;
      engineRef.current?.Dispose();
      engineRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* Three.js Canvas */}
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Scene Name at Top Center */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-2xl font-bold">
        {currentSceneName}
      </div>

      {/* Control Panel at Top Left */}
      <div className="flex flex-col absolute top-2 left-2 pt-4 pl-4 text-white z-10">
        <button className="cursor-pointer bg-blue-900 rounded-xl py-2"
          onClick={() => router.push('/')}
          >Back to Landing Page
        </button>

        <button className="cursor-pointer bg-blue-900 rounded-xl py-2"
          onClick={() => engineRef.current?.ToggleLock()}
          >🔒 Lock In
        </button>

        <label className="text-md">Time Scale</label>
        <input className="w-48"
          type="range"
          min="1"
          max="1000"
          value={timeScale}
          onChange={(e) => {
            const val = Number(e.target.value);
            setTimeScale(val);
            engineRef.current?.SetTimeScale(val);
          }}
        />
      </div>
    </div>
  );
};