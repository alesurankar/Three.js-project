import BaseDropdown from "./BaseDropdown";
import { useRouter } from 'next/navigation';


interface StarsDropdownProps {
  open: boolean;
  x: number;
  y: number;
} 

const StarsDropdown = ({ open, x, y }: StarsDropdownProps) => {
  const router = useRouter();

  const enterUniverse = (scene: string) => {
    router.push(`/universe?scene=${scene}`);
  };
  const itemClass =
    "hover:text-yellow-200 hover:scale-105 whitespace-nowrap px-2 py-2 text-left w-full";

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className={itemClass} onClick={() => enterUniverse('SolarSystem')}>
        Solar System
      </button>

      <button className={itemClass} onClick={() => enterUniverse('AlphaCentauriSystem')}>
        Alpha Centauri System
      </button>

      <button className={itemClass} onClick={() => enterUniverse('ProximaCentauri')}>
        Proxima Centauri
      </button>
    </BaseDropdown>
  );
};

export default StarsDropdown