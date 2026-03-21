'use client';

import { useRouter } from 'next/navigation';


export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="p-4 mx-6 sm:mx-2 md:mx-4 my-6 border border-gray-600
        rounded-xl bg-gray-900 text-white text-center">

      {/* Top: Title */}
      <h1 className="text-4xl font-bold mt-4 mb-12">This is an Universe Simulation</h1>
      
      {/* Middle: Description */}
      <p className="text-2xl mb-8">
        This is a universe simulator. It uses real-world data to generate objects and allows you to explore and adjust various scales dynamically.
      </p>
      
      {/* Bottom: Button */}
      <div className="flex flex-col gap-6">
        <button className="active:bg-blue-900 bg-blue-800 hover:bg-blue-700 py-4 rounded-lg text-2xl font-bold"
          onClick={() => router.push('/universe')}
        >Enter the Universe
        </button>
      </div>
    </div>
  );
}
