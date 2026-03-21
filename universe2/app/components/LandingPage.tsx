'use client';

import { useRouter } from 'next/navigation';
import Button from '../utils/Button';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{
      padding: "40px",
      maxWidth: "500px",
      margin: "50px auto",
      border: "2px solid #ccc",
      borderRadius: "12px",
      backgroundColor: "#1f2d33",
      color: "white",
      textAlign: "center"
    }}>
      <h1 className="text-4xl font-bold mb-8">Welcome to Universe</h1>

      <div className="flex flex-col gap-6">
        <Button
          title="Enter Universe"
          mainClassName="bg-[#1e5a8a] hover:bg-[#3b7db5] py-4 rounded"
          titleClassName="text-2xl font-bold uppercase"
          onClick={() => router.push('/universe')}
        />
        <Button
          title="Open Helpers"
          mainClassName="bg-[#7c2923] hover:bg-[#d5453a] py-4 rounded"
          titleClassName="text-2xl font-bold uppercase"
          onClick={() => router.push('/helpers')}
        />
      </div>
    </div>
  );
}
