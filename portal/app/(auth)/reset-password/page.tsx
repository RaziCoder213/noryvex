"use client";

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Missing reset token');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset password');
      }

      setStatus('success');
      setMessage('Password reset successfully');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111111] border border-[#222222] rounded-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">New Password</h1>
          <p className="text-gray-400 text-sm">Enter your new password below</p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm mb-6">
              {message}
            </div>
            <p className="text-sm text-gray-400">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
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
              {status === 'loading' ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center mt-4">
              <Link href="/login" className="text-gray-400 hover:text-white text-sm">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
