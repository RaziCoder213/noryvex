"use client";

import { useState } from "react";
import { createPatient } from "./actions";

export function PatientModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createPatient(formData);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#222222] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-[#222222] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Add Patient</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <form action={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input required name="name" type="text" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
            <input required name="phone" type="tel" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input name="email" type="email" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select name="status" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lead">Lead</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm text-gray-300 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

