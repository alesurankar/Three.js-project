'use client';

import { useState } from 'react';
import { Russo_One } from 'next/font/google';
import SideWindow from './sideWindow/SideWindow';
import GalaxyesDropdown from './dropdown/GalaxyesDropdown';
import PlanetsDropdown from './dropdown/PlanetsDropdown';
import StarsDropdown from './dropdown/StarsDropdown';


const russoOne = Russo_One({ subsets: ['latin'], weight: '400' });

export default function LandingPage() {
  const [planetsDropdown, setPlanetsDropdown] = useState(false);
  const [starsDropdown, setStarsDropdown] = useState(false);
  const [galaxyesDropdown, setGalaxyesDropdown] = useState(false);
  const [sideWindow, setSideWindow] = useState<string | null>(null);

  return (
    <div className={`flex flex-col ${russoOne.className} mt-10 text-center text-white w-full h-screen`}>

      {/* Top: Navigation Buttons */}
      <div className="flex justify-center bg-blue-900/30 gap-6 text-white py-2 mx-12 
        rounded-xl text-2xl shadow-[0_0_20px_rgba(0,191,255,0.7)]">
        <div className="relative">
          <button 
            className="rounded-xl hover:text-yellow-200 hover:scale-105 
              transition-all duration-300 px-2"
              onClick={() => {
                setPlanetsDropdown(prev => !prev);
                setStarsDropdown(false)
                setGalaxyesDropdown(false)
              }}
            >Planets
          </button>
          <PlanetsDropdown 
            open={planetsDropdown} x={-50} y={50}
            onSelect={(scene) => {
              setSideWindow(scene);
              setPlanetsDropdown(false);
            }}
          />
        </div>

        <div className="relative">
          <button 
            className="rounded-xl hover:text-yellow-200 hover:scale-105 
              transition-all duration-300 px-2"
              onClick={() => {
                setPlanetsDropdown(false)
                setStarsDropdown(prev => !prev);
                setGalaxyesDropdown(false)
              }}
            >Stars
          </button>
          <StarsDropdown 
            open={starsDropdown} x={-70} y={50}
            onSelect={(scene) => {
              setSideWindow(scene);
              setStarsDropdown(false);
            }}
          />
        </div>

        <div className="relative">
          <button 
            className="rounded-xl hover:text-yellow-200 hover:scale-105 
              transition-all duration-300 px-2"
              onClick={() => {
                setPlanetsDropdown(false)
                setStarsDropdown(false)
                setGalaxyesDropdown(prev => !prev);
              }}
            >Galaxyes
          </button>
          <GalaxyesDropdown 
            open={galaxyesDropdown} x={-10} y={50}
            onSelect={(scene) => {
              setSideWindow(scene);
              setGalaxyesDropdown(false);
            }}
          />
        </div>
      </div>
      
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
        <SideWindow
          open={sideWindow !== null}
          onClose={() => setSideWindow(null)}
        >{sideWindow}
        </SideWindow>
      </div>
    </div>
  );
};
