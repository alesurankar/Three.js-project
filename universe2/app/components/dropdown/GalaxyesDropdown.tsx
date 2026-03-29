import BaseDropdown from "./BaseDropdown";
import { useRouter } from 'next/navigation';


interface GalaxyesDropdownProps {
  open: boolean;
  x: number;
  y: number;
}
const itemClass =
  "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";


const GalaxyesDropdown = ({ open, x, y }: GalaxyesDropdownProps) => {
  const router = useRouter();

  const enterUniverse = (scene: string) => {
    router.push(`/universe?scene=${scene}`);
  };
  const itemClass =
    "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className={itemClass} onClick={() => enterUniverse('MilkyWay')}>
        GalaxyesDropdown
      </button>
    </BaseDropdown>
  );
};

export default GalaxyesDropdown