"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InternalNotes({ callId, initialNotes }: { callId: string, initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/calls/${callId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add internal notes about this call..."
        className="w-full h-32 bg-[#111111] border border-[#222222] rounded-md p-3 text-white text-sm focus:outline-none focus:border-gray-500 resize-none"
      />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isSaving ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </div>
  );
}
