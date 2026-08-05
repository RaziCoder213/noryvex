"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createWorkspace } from './actions';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  industry: z.enum(['dental', 'medical', 'restaurant', 'legal', 'home_services']),
  timezone: z.string().min(1, 'Timezone is required'),
});

type FormType = z.infer<typeof schema>;

export default function WorkspaceModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { timezone: 'America/New_York', industry: 'dental' },
  });

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    setServerError('');
    setSuccessMsg('');

    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));

    try {
      const result = await createWorkspace(formData);
      if (result.success) {
        setSuccessMsg(`Workspace created! URL: ${result.subdomain}.trynoryvex.com`);
        setTimeout(() => {
          setIsOpen(false);
          setSuccessMsg('');
          reset();
          router.refresh();
        }, 1500);
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
        + New Workspace
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Create Workspace</h2>

            {serverError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                ✅ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
                <input
                  {...register('name')}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                  placeholder="Smile Care Dental"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subdomain</label>
                <div className="flex items-center gap-2">
                  <input
                    {...register('subdomain')}
                    className="flex-1 bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                    placeholder="smilecare"
                  />
                  <span className="text-[#71717a] text-sm whitespace-nowrap">.trynoryvex.com</span>
                </div>
                {errors.subdomain && <p className="text-red-500 text-xs mt-1">{errors.subdomain.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
                <select
                  {...register('industry')}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                >
                  <option value="dental">Dental</option>
                  <option value="medical">Medical</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="legal">Legal</option>
                  <option value="home_services">Home Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                <select
                  {...register('timezone')}
                  className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                >
                  <option value="America/New_York">Eastern (ET)</option>
                  <option value="America/Chicago">Central (CT)</option>
                  <option value="America/Denver">Mountain (MT)</option>
                  <option value="America/Los_Angeles">Pacific (PT)</option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Karachi">Pakistan (PKT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                </select>
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
                  disabled={loading}
                  className="bg-[#6366f1] hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
