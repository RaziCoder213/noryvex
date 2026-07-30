"use client";

import { useState } from "react";
import { createKnowledgeDoc } from "./actions";

export function KnowledgeForm({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docType, setDocType] = useState("text");

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createKnowledgeDoc(formData);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#222222] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-[#222222] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Add Knowledge Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <form action={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select 
              name="type" 
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="text">Text / FAQ</option>
              <option value="url">Website URL</option>
              <option value="document">Upload Document</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input required name="title" type="text" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500" />
          </div>
          
          {docType === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
              <textarea required name="content" rows={6} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500 resize-none" />
            </div>
          )}

          {docType === "url" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Source URL</label>
              <input required name="source_url" type="url" placeholder="https://" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-3 py-2 text-white focus:outline-none focus:border-gray-500" />
            </div>
          )}

          {docType === "document" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">File (PDF, DOCX)</label>
              <input required type="file" accept=".pdf,.docx,.txt" className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333]" />
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm text-gray-300 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

