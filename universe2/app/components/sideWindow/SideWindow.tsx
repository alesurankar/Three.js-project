"use client"

import { ReactNode } from "react";
import { useRouter } from 'next/navigation';


interface SideWindowProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const SideWindow = ({ open, onClose, children }: SideWindowProps) => {
  if (!open) return null;
  const router = useRouter();
  const scene = typeof children === "string" ? children : "";
  
  const enterUniverse = (scene: string) => {
    if (scene) {
      router.push(`/universe?scene=${scene}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-blue-900/10 flex-1 text-white e m-3 rounded  shadow-[0_0_20px_rgba(0,191,255,0.7)]">
      <button 
        className="absolute top-0 right-0 text-4xl text-red-800 p-3" 
        onClick={onClose}
        >X
      </button>
      
      <div className="text-2xl mt-6">
        {children}
      </div>

      <button
        className="absolute bottom-50 cursor-pointer border-2 px-3 py-1 rounded hover:bg-white/20 text-2xl"
        onClick={() => enterUniverse(scene)}
      >Enter {scene} Scene
      </button>
    </div>
  );
};

export default SideWindow;