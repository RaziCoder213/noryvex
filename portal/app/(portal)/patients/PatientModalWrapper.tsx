"use client";

import { useState } from "react";
import { PatientModal } from "./PatientModal";

export function PatientModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Add Patient
      </button>
      <PatientModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

