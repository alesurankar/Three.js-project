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

export default GalaxyesDropdown