"use client"

import { ReactNode } from "react";


export interface DropdownItem {
  label: string;
  value: string;
}

interface BaseDropdownProps {
  open: boolean;
  x: number;
  y: number;
  items?: DropdownItem[];
  onSelect?: (value: string) => void;
  children?: ReactNode;
}

const BaseDropdown = ({ open, x, y, items, onSelect, children }: BaseDropdownProps) => {
  if (!open) return null;

  const containerClass = 
    "pointer-events-auto absolute bg-blue-900/90 text-white p-2 rounded shadow-[0_0_20px_rgba(0,191,255,0.7)] z-50";

  const itemClass =
    "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";

  return (
    <div className={containerClass} style={{ top: y, left: x }}>
      {items
      ? items.map((item) => (
          <button
            type="button"
            key={item.value}
            className={itemClass}
            onClick={() => onSelect?.(item.value)}
          >
            {item.label}
          </button>
        ))
      : children}
    </div>
  );
};

export default BaseDropdown;