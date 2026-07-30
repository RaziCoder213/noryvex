"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function CallsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [outcome, setOutcome] = useState(searchParams.get("outcome") || "");

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset to page 1 on filter change
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Search caller name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={(e) => updateFilters("search", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && updateFilters("search", search)}
        className="bg-[#111111] border border-[#222222] rounded-md px-4 py-2 text-white text-sm w-64 focus:outline-none focus:border-gray-500"
      />
      
      <select
        value={outcome}
        onChange={(e) => {
          setOutcome(e.target.value);
          updateFilters("outcome", e.target.value);
        }}
        className="bg-[#111111] border border-[#222222] rounded-md px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
      >
        <option value="">All Outcomes</option>
        <option value="answered">Answered</option>
        <option value="missed">Missed</option>
        <option value="voicemail">Voicemail</option>
      </select>
    </div>
  );
}

