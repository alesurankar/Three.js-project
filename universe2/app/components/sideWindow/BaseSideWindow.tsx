"use client"

import { ReactNode } from "react";


interface BaseSideWindowProps {
  open: boolean;
  children?: ReactNode;
}

const BaseSideWindow = ({ open, children }: BaseSideWindowProps) => {
  if (!open) return null;

  return (
    <div className="absolute bg-gray-800/40 text-white p-3 rounded"
      style={{ top: 560, left: 800 }}
    >{children}
    This is Base SideWindow
    </div>
  );
};

export default BaseSideWindow;