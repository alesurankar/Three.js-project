'use client';

import { useRouter } from 'next/navigation';


export default function LandingPage() {
  const router = useRouter();

  const enterUniverse = (scene: string) => {
    router.push(`/universe?scene=${scene}`);
  };

  return (
    <div className="mt-12 text-center">
      <div className="flex justify-center gap-6 mb-12">
        <button 
          className="bg-blue-800 text-white py-4 px-8 rounded-xl text-2xl
            hover:bg-blue-700 hover:scale-105 transition-all duration-300
            shadow-[0_0_20px_rgba(0,191,255,0.7)] hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
            onClick={() => enterUniverse('TestScene')}
          >Test Scene
        </button>
        <button 
          className="bg-blue-800 text-white py-4 px-8 rounded-xl text-2xl
            hover:bg-blue-700 hover:scale-105 transition-all duration-300
            shadow-[0_0_20px_rgba(0,191,255,0.7)] hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
            onClick={() => enterUniverse('MoonOrbit')}
          >Enter Moon Orbit
        </button>
        <button 
          className="bg-blue-800 text-white py-4 px-8 rounded-xl text-2xl
            hover:bg-blue-700 hover:scale-105 transition-all duration-300
            shadow-[0_0_20px_rgba(0,191,255,0.7)] hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
            onClick={() => enterUniverse('SolarSystem')}
          >Enter Solar System
        </button>
      </div>

      <div className="mt-12 text-white text-center">

        {/* Top: Title */}
        <h1 className="text-8xl font-bold mt-4 mb-12 text-yellow-200">This is an Universe Simulation</h1>
        
        {/* Middle: Description */}
        <p className="text-4xl mb-8 text-yellow-100">
          This universe simulator uses real-world data to generate objects and allows you to explore and adjust various scales dynamically.
        </p>
        
      </div>
    
    </div>
  );
};
