import BaseDropdown from "./BaseDropdown";


interface PlanetsDropdownProps {
  open: boolean;
  x: number;
  y: number;
  onSelect: (scene: string) => void;
}

const PlanetsDropdown = ({ open, x, y, onSelect }: PlanetsDropdownProps) => {
  const itemClass =
    "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className={itemClass}
        onClick={() => onSelect("MercuryOrbit")}>
        Mercury Orbit
      </button>

      <button className={itemClass}
        onClick={() => onSelect("VenusOrbit")}>
        Venus Orbit
      </button>

      <button className={itemClass}
        onClick={() => onSelect("EarthOrbit")}>
        Earth Orbit
      </button>
    </BaseDropdown>
  );
};

export default PlanetsDropdown