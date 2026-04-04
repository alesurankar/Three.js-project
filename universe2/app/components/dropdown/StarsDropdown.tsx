import BaseDropdown from "./BaseDropdown";


interface StarsDropdownProps {
  open: boolean;
  x: number;
  y: number;
  onSelect: (scene: string) => void;
} 

const objects = [
  { label: "Solar System", value: "SolarSystem" },
  { label: "Alpha Centauri System", value: "AlphaCentauriSystem" },
  { label: "Proxima Centauri", value: "ProximaCentauri" },
];

const StarsDropdown = ({ open, x, y, onSelect }: StarsDropdownProps) => {
  
  return (
    <BaseDropdown
      open={open}
      x={x}
      y={y}
      onSelect={onSelect}
      items={objects}
    />
  );
};

export default StarsDropdown