import BaseDropdown from "./BaseDropdown";
import { useRouter } from 'next/navigation';


interface GalaxiesDropdownProps {
  open: boolean;
  x: number;
  y: number;
}

const GalaxiesDropdown = ({ open, x, y }: GalaxiesDropdownProps) => {
  const router = useRouter();

  const enterUniverse = (scene: string) => {
    router.push(`/universe?scene=${scene}`);
  };

  return (
    <BaseDropdown open={open} x={x} y={y} >
      <button className="hover:text-yellow-200 hover:scale-105"
        onClick={() => enterUniverse('TestScene')}
      >GalaxiesDropdown</button>
    </BaseDropdown>
  );
};

export default GalaxiesDropdown