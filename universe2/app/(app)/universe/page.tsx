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

    const handleResize = () => engineRef.current?.Resize();
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", handleResize);
      engineRef.current?.Dispose();
      engineRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black">
      {/* Three.js Canvas */}
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Scene Name at Top Center */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-white text-3xl font-bold z-20">
        {currentSceneName}
      </div>

      {/* Control Panel at Top Left */}
      <div className="absolute top-6 left-4 flex flex-col gap-3 text-white z-20 w-64 h-56">
        <button className="cursor-pointer active:bg-blue-900 bg-blue-800 hover:bg-blue-700 transition text-lg text-white px-4 py-2 rounded-xl"
          onClick={() => router.push('/')}
          >Back to Landing Page
        </button>

        <button className="cursor-pointer active:bg-blue-900 bg-blue-800 hover:bg-blue-700 transition text-lg text-white px-4 py-2 rounded-xl"
          onClick={() => engineRef.current?.ToggleLock()}
          >🔒 Lock In
        </button>
        
        {/* Centered label + input */}
        <div className="flex flex-col items-center justify-center flex-1">
          <label className="text-lg mb-2">Time Scale</label>
          <input
            className="cursor-pointer w-full"
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
    </div>
  );
};