"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from './actions';

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(6),
  workspaceId: z.string().min(1)
});

type FormType = z.infer<typeof schema>;

export default function ClientModal({ workspaces }: { workspaces: {id: string, name: string}[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    
    await createClient(formData);
    setLoading(false);
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#6366f1] hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Create Client
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Create New Client</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input {...register('fullName')} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" placeholder="John Doe" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input {...register('email')} type="email" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input {...register('password')} type="password" className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" placeholder="••••••••" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Workspace</label>
                <select {...register('workspaceId')} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors appearance-none">
                  <option value="">Select a workspace...</option>
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                  ))}
                </select>
                {errors.workspaceId && <p className="text-red-500 text-xs mt-1">{errors.workspaceId.message}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="bg-[#6366f1] hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
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

