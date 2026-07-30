"use client";

import { useState } from 'react';
import { saveVapiConfig } from './actions';

export default function VapiModal({ workspaceId, existing }: { workspaceId: string, existing?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await saveVapiConfig(workspaceId, formData);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-[#222222] hover:bg-[#333333] text-white px-3 py-1.5 rounded text-sm transition-colors"
      >
        Configure
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Configure Vapi Assistant</h2>
            
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vapi ID</label>
                  <input name="vapi_id" defaultValue={existing?.vapiId} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input name="name" defaultValue={existing?.name} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Voice ID</label>
                  <input name="voice_id" defaultValue={existing?.voiceId} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                  <select name="model" defaultValue={existing?.model || 'gpt-4o'} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors appearance-none">
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                  <input name="phone_number" defaultValue={existing?.phone} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Transfer Number</label>
                  <input name="transfer_number" defaultValue={existing?.transferNumber} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">First Message</label>
                <input name="first_message" defaultValue={existing?.firstMessage} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">System Prompt</label>
                <textarea name="system_prompt" rows={6} defaultValue={existing?.systemPrompt} className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors resize-y" />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="bg-[#6366f1] hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Config'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

