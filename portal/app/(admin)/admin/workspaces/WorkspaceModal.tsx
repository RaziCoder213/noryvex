"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkspace } from './actions';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Alphanumeric and hyphens only, all lowercase'),
  industry: z.enum(['dental', 'medical', 'restaurant', 'legal', 'home_services']),
  timezone: z.string().min(1, 'Timezone is required')
});

type FormType = z.infer<typeof schema>;

export default function WorkspaceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { timezone: 'America/New_York' }
  });

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    
    await createWorkspace(formData);
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
        Create Workspace
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Create Workspace</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input {...register('name')} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" placeholder="Acme Corp" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subdomain</label>
                <input {...register('subdomain')} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" placeholder="acme-corp" />
                {errors.subdomain && <p className="text-red-500 text-xs mt-1">{errors.subdomain.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
                <select {...register('industry')} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors appearance-none">
                  <option value="dental">Dental</option>
                  <option value="medical">Medical</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="legal">Legal</option>
                  <option value="home_services">Home Services</option>
                </select>
                {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                <input {...register('timezone')} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" />
                {errors.timezone && <p className="text-red-500 text-xs mt-1">{errors.timezone.message}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="bg-[#6366f1] hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
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

