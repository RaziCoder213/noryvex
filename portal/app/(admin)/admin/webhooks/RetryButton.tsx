"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RetryButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRetry = async () => {
    setLoading(true);
    await fetch('/api/webhooks/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button 
      onClick={handleRetry} 
      disabled={loading} 
      className="text-sm text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50"
    >
      {loading ? 'Retrying...' : 'Retry'}
    </button>
  );
}

