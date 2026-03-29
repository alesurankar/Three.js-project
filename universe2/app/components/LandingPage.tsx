'use client';

import { useState } from 'react';
import { Russo_One } from 'next/font/google';
import BaseSideWindow from './sideWindow/BaseSideWindow';
import GalaxiesDropdown from './dropdown/GalaxiesDropdown';
import PlanetsDropdown from './dropdown/PlanetsDropdown';
import StarsDropdown from './dropdown/StarsDropdown';


const russoOne = Russo_One({ subsets: ['latin'], weight: '400' });


export default function LandingPage() {
  const [planetsDropdown, setPlanetsDropdown] = useState(false);
  const [starsDropdown, setStarsDropdown] = useState(false);
  const [galaxyesDropdown, setGalaxiesDropdown] = useState(false);



  return (
    <div className={`flex flex-col ${russoOne.className} mt-10 text-center text-white w-full h-screen`}>

      {/* Top: Navigation Buttons */}
      <div className="flex justify-center bg-blue-800/30 gap-6 text-white py-2 mx-12 
        rounded-xl text-2xl shadow-[0_0_20px_rgba(0,191,255,0.7)]">
        <div className="relative">
          <button 
            className="rounded-xl hover:text-yellow-200 hover:scale-105 
              transition-all duration-300 px-2"
              onClick={() => {
                setPlanetsDropdown(prev => !prev);
                setStarsDropdown(false)
                setGalaxiesDropdown(false)
              }}
            >Planets
          </button>
          <PlanetsDropdown open={planetsDropdown} x={-50} y={50}/>
        </div>

        <div className="relative">
          <button 
            className="rounded-xl hover:text-yellow-200 hover:scale-105 
              transition-all duration-300 px-2"
              onClick={() => {
                setPlanetsDropdown(false)
                setStarsDropdown(prev => !prev);
                setGalaxiesDropdown(false)
              }}
            >Stars
          </button>
          <StarsDropdown open={starsDropdown} x={-50} y={50}/>
        </div>

        <div className="relative">
          <button 
            className="rounded-xl hover:text-yellow-200 hover:scale-105 
              transition-all duration-300 px-2"
              onClick={() => {
                setPlanetsDropdown(false)
                setStarsDropdown(false)
                setGalaxiesDropdown(prev => !prev);
              }}
            >Galaxies
          </button>
          <GalaxiesDropdown open={galaxyesDropdown} x={-50} y={50}/>
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
        <BaseSideWindow open={true}>
        </BaseSideWindow>
      </div>
    </div>
  );
};
