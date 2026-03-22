'use client';

import { useRouter } from 'next/navigation';
import { useState } from "react";
import Button from "@/app/utils/Button";
import Modal from '@/app/utils/Modal';
import EntityForm from "@/app/components/EntityForm";

export default function Helper() 
{
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const openModal = (type: string) => {
    setSelectedType(type);
    setShow(true);
  };

  return (
    <div style={{
      padding: "40px",
      maxWidth: "400px",
      margin: "50px auto",
      border: "2px solid #ccc",
      borderRadius: "12px",
      backgroundColor: "#2e484f",
      color: "white",
    }}>
      <h1>Create Entity</h1>
      <div className='flex items-center justify-between'></div>
      <Button
        title="Back to Landing Page"
        mainClassName="bg-[#1e5a8a] hover:bg-[#3b7db5] py-4 rounded"
        titleClassName="text-2xl font-bold uppercase"
        onClick={() => router.push('/')}
      />
      <Button
        title='Add Star'
        mainClassName='bg-[#7c2923] hover:bg-[#d5453a]'
        titleClassName='text-3xl text-white font-bold uppercase'
        onClick={() => { openModal("star"); setShow(true); }}
      />
      <Button
        title='Add Planet'
        mainClassName='bg-[#7c2923] hover:bg-[#d5453a]'
        titleClassName='text-3xl text-white font-bold uppercase'
        onClick={() => { openModal("planet"); setShow(true); }}
      />
      {/* Modal */}
      {show && selectedType &&(
        <Modal onClose={() => setShow(false)} maxWidth="max-w-3xl">
            <EntityForm type={selectedType as "star" | "planet"} onSuccess={() => setShow(false)} />
        </Modal>
      )}
    </div>
  );
};