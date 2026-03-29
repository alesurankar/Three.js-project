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

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className="hover:text-yellow-200 hover:scale-105"
        onClick={() => enterUniverse('SolarSystem')}
      >StarsDropdown</button>
    </BaseDropdown>
  );
};

export default StarsDropdown