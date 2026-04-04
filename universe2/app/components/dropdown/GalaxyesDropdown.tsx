import BaseDropdown from "./BaseDropdown";


interface GalaxyesDropdownProps {
  open: boolean;
  x: number;
  y: number;
  onSelect: (scene: string) => void;
}

const objects = [
  { label: "Milky Way", value: "MilkyWay" },
];

const GalaxyesDropdown = ({ open, x, y, onSelect }: GalaxyesDropdownProps) => {
  
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

export default GalaxyesDropdown