'use client';

import { useRouter } from 'next/navigation';


export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="p-10 max-w-lg my-12 mx-auto border-1 border-gray-600
        rounded-xl bg-gray-900 text-white text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Universe</h1>

      <div className="flex flex-col gap-6">
        <button className="active:bg-blue-900 bg-blue-800 hover:bg-blue-700 py-4 rounded-lg text-2xl font-bold uppercase"
          onClick={() => router.push('/universe')}
        >Enter Universe
        </button>
      </div>
    </div>
  );
}
