"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!res.ok) throw new Error('Failed to send request');
      
      setStatus('success');
      setMessage('If your email is registered, you will receive a reset link');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111111] border border-[#222222] rounded-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm">Enter your email to receive a reset link</p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm mb-6">
              {message}
            </div>
            <Link href="/login" className="text-[#6366f1] hover:text-indigo-400 text-sm font-medium">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder="name@company.com"
              />
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#6366f1] hover:bg-indigo-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className="text-center mt-4">
              <Link href="/login" className="text-gray-400 hover:text-white text-sm">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

