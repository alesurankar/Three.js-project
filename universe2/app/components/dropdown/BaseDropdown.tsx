"use client"

import { ReactNode } from "react";


interface BaseDropdownProps {
  open: boolean;
  x: number;
  y: number;
  children?: ReactNode;
}

const BaseDropdown = ({ open, x, y, children }: BaseDropdownProps) => {
  if (!open) return null;

  return (
    <div
      className="pointer-events-auto absolute bg-blue-900/90 text-white p-2 rounded shadow-[0_0_20px_rgba(0,191,255,0.7)]"
      style={{ top: y, left: x }}
    >{children}
    </div>
  );
};

export default BaseDropdown;