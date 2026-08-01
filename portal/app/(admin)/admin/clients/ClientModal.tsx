"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createClient } from './actions';

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  workspaceId: z.string().min(1, 'Select a workspace'),
});

type FormType = z.infer<typeof schema>;

export default function ClientModal({
  workspaces,
}: {
  workspaces: { id: string; name: string; subdomain: string }[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const selectedWorkspaceId = watch('workspaceId');
  const selectedWs = workspaces.find(w => w.id === selectedWorkspaceId);

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    setServerError('');
    setSuccessMsg('');

    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));

    try {
      const result = await createClient(formData);
      if (result.success) {
        setSuccessMsg('Client created! They can now log in to their portal.');
        setTimeout(() => {
          setIsOpen(false);
          setSuccessMsg('');
          reset();
          router.refresh();
        }, 1800);
      } else {
        setServerError(result.error || 'Something went wrong.');
      }
    } catch (e: any) {
      setServerError(e?.message || 'Unexpected error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); setServerError(''); setSuccessMsg(''); }}
        className="bg-[#6366f1] hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        + New Client
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Create Client Login</h2>
            <p className="text-[#71717a] text-sm mb-6">
              This creates a login for your client to access their portal.
            </p>

            {serverError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                ❌ {serverError}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                ✅ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  {...register('fullName')}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                  placeholder="Dr. John Smith"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email (login)</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                  placeholder="client@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                  placeholder="Min 6 characters"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Workspace</label>
                {workspaces.length === 0 ? (
                  <p className="text-yellow-500 text-sm">No workspaces yet. Create a workspace first.</p>
                ) : (
                  <select
                    {...register('workspaceId')}
                    className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                  >
                    <option value="">Select a workspace...</option>
                    {workspaces.map(ws => (
                      <option key={ws.id} value={ws.id}>{ws.name}</option>
                    ))}
                  </select>
                )}
                {errors.workspaceId && <p className="text-red-500 text-xs mt-1">{errors.workspaceId.message}</p>}
                {selectedWs && (
                  <p className="text-[#6366f1] text-xs mt-1 font-mono">
                    Portal: {selectedWs.subdomain}.trynoryvex.com
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); reset(); setServerError(''); }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || workspaces.length === 0}
                  className="bg-[#6366f1] hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
