import BaseDropdown from "./BaseDropdown";
import { useRouter } from 'next/navigation';


interface PlanetsDropdownProps {
  open: boolean;
  x: number;
  y: number;
}

const PlanetsDropdown = ({ open, x, y }: PlanetsDropdownProps) => {
  const router = useRouter();

  const enterUniverse = (scene: string) => {
    router.push(`/universe?scene=${scene}`);
  };

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className="hover:text-yellow-200 hover:scale-105"
        onClick={() => enterUniverse('MoonOrbit')}
      >PlanetsDropdown</button>
    </BaseDropdown>
  );
};

export default PlanetsDropdown