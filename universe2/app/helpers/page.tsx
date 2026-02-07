'use client';

import { useState } from "react";
import Button from "../utils/Button";
import Modal from '../utils/Modal';
import EntityForm from "../components/EntityForm";



export default function Helper() {
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
          title='Add Star'
          mainClassName='bg-red-500 hover:bg-red-600'
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
              <EntityForm 
              defaultType={selectedType}
              onSuccess={() => setShow(false)} 
              />
          </Modal>
      )}
    </div>
  );
};