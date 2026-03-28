'use client';

import { useRouter } from 'next/navigation';
import { Russo_One } from 'next/font/google';
import BaseSideWindow from './sideWindow/BaseSideWindow';
import BaseDropdown from './dropdown/BaseDropdown';


const russoOne = Russo_One({ subsets: ['latin'], weight: '400' });


export default function LandingPage() {
  const router = useRouter();

  const enterUniverse = (scene: string) => {
    router.push(`/universe?scene=${scene}`);
  };

  return (
    <div className={`flex flex-col ${russoOne.className} mt-10 text-center text-white w-full h-screen`}>

      {/* Top: Navigation Buttons */}
      <div className="flex justify-center gap-6 text-white p-1 m-1">
        <button 
          className="bg-blue-800 text-white py-4 px-6 rounded-xl text-2xl
            hover:bg-blue-700 hover:scale-105 transition-all duration-300
            shadow-[0_0_20px_rgba(0,191,255,0.7)] hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
            onClick={() => enterUniverse('TestScene')}
          >Test Scene
        </button>
        <button 
          className="bg-blue-800 text-white py-4 px-6 rounded-xl text-2xl
            hover:bg-blue-700 hover:scale-105 transition-all duration-300
            shadow-[0_0_20px_rgba(0,191,255,0.7)] hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
            onClick={() => enterUniverse('MoonOrbit')}
          >Enter Moon Orbit
        </button>
        <button 
          className="bg-blue-800 text-white py-4 px-6 rounded-xl text-2xl
            hover:bg-blue-700 hover:scale-105 transition-all duration-300
            shadow-[0_0_20px_rgba(0,191,255,0.7)] hover:shadow-[0_0_30px_rgba(0,255,255,0.9)]"
            onClick={() => enterUniverse('SolarSystem')}
          >Enter Solar System
        </button>
      </div>
      
      <BaseDropdown open={true} x={30} y={30}>
      </BaseDropdown>
      
      {/* Top: Title */}
      <div className="flex text-center items-center justify-center p-1 m-1">
        
        <h1 className="text-8xl font-bold mt-4 mb-12 text-yellow-200">This is an Universe Simulation</h1>
      </div>

      {/* Middle: Description */}
      <div className="flex text-center items-center justify-center p-1 m-1">
        <p className="text-4xl mb-8 text-yellow-100">
          This universe simulator uses real-world data to generate objects and allows you to adjust time scales.
        </p>
      </div>

      {/* Bottom Content */}
      <div className="flex flex-1 text-white p-1 m-1">
        <BaseSideWindow open={true}>
        </BaseSideWindow>
      </div>
    </div>
  );
};
