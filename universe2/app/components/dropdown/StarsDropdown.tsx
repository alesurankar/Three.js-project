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
  const itemClass =
    "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";

  return (
    <BaseDropdown open={open} x={x} y={y}>
      {objects.map((object) => (
        <button 
          key={object.value}
          className={itemClass}
          onClick={() => onSelect(object.value)}>
          {object.label}
        </button>
      ))}
    </BaseDropdown>
  );
};

export default StarsDropdown