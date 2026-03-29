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
    <div className="relative flex flex-col bg-white/10 flex-1 text-white p-3 rounded">
      <button 
        className="absolute top-6 right-8 text-4xl text-red-800" 
        onClick={onClose}
        >X
      </button>
      {children}
      <button
        className="cursor-pointer border-2 px-3 py-1 rounded hover:bg-white/20"
        onClick={() => enterUniverse(scene)}
      >
        Enter {scene}
      </button>
    </div>
  );
};

export default SideWindow;