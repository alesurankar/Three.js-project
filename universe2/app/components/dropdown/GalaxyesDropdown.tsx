import BaseDropdown from "./BaseDropdown";
import { useRouter } from 'next/navigation';


interface GalaxyesDropdownProps {
  open: boolean;
  x: number;
  y: number;
  onSelect: (scene: string) => void;
}

const GalaxyesDropdown = ({ open, x, y, onSelect }: GalaxyesDropdownProps) => {
  const itemClass =
    "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className={itemClass}
        onClick={() => onSelect("MilkyWay")}>
        Milky Way
      </button>
    </BaseDropdown>
  );
};

export default GalaxyesDropdown