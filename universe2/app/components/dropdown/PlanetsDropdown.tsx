import BaseDropdown from "./BaseDropdown";


interface PlanetsDropdownProps {
  open: boolean;
  x: number;
  y: number;
  onSelect: (scene: string) => void;
}

const objects = [
  { label: "Test Scene", value: "TestScene" },
  { label: "Mercury Orbit", value: "MercuryOrbit" },
  { label: "Venus Orbit", value: "VenusOrbit" },
  { label: "Earth Orbit", value: "EarthOrbit" },
  { label: "Moon Orbit", value: "MoonOrbit" },
  { label: "Mars Orbit", value: "MarsOrbit" },
  { label: "Jupiter Orbit", value: "JupiterOrbit" },
  { label: "Saturn Orbit", value: "SaturnOrbit" },
  { label: "Uranus Orbit", value: "UranusOrbit" },
  { label: "Proxima B Orbit", value: "ProximaBOrbit" },
];

const PlanetsDropdown = ({ open, x, y, onSelect }: PlanetsDropdownProps) => {
  
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

export default PlanetsDropdown