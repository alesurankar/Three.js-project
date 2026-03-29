import BaseDropdown from "./BaseDropdown";


interface StarsDropdownProps {
  open: boolean;
  x: number;
  y: number;
  onSelect: (scene: string) => void;
} 

const StarsDropdown = ({ open, x, y, onSelect }: StarsDropdownProps) => {
  const itemClass =
    "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className={itemClass}
        onClick={() => onSelect("SolarSystem")}>
        Solar System
      </button>

      <button className={itemClass}
        onClick={() => onSelect("AlphaCentauriSystem")}>
        Alpha Centauri System
      </button>

      <button className={itemClass}
        onClick={() => onSelect("ProximaCentauri")}>
        Proxima Centauri
      </button>
    </BaseDropdown>
  );
};

export default StarsDropdown