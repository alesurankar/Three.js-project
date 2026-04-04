import BaseDropdown from "./BaseDropdown";


interface PlanetsDropdownProps {
  open: boolean;
  x: number;
  y: number;
  onSelect: (scene: string) => void;
}

const objects = [
  { label: "Mercury Orbit", value: "MercuryOrbit" },
  { label: "Venus Orbit", value: "VenusOrbit" },
  { label: "Earth Orbit", value: "EarthOrbit" },
  { label: "Moon Orbit", value: "MoonOrbit" },
  { label: "Mars Orbit", value: "MarsOrbit" },
  { label: "Jupiter Orbit", value: "JupiterOrbit" },
  { label: "Saturn Orbit", value: "SaturnOrbit" },
  { label: "Proxima B Orbit", value: "ProximaBOrbit" },
];

const PlanetsDropdown = ({ open, x, y, onSelect }: PlanetsDropdownProps) => {
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

export default PlanetsDropdown