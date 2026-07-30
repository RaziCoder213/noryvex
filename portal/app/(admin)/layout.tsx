import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="bg-[#111111] border-b border-[#222222] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold text-white">Noryvex Admin</Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin/clients" className="text-sm text-gray-300 hover:text-white transition-colors">Clients</Link>
            <Link href="/admin/workspaces" className="text-sm text-gray-300 hover:text-white transition-colors">Workspaces</Link>
            <Link href="/admin/vapi" className="text-sm text-gray-300 hover:text-white transition-colors">Vapi Config</Link>
            <Link href="/admin/webhooks" className="text-sm text-gray-300 hover:text-white transition-colors">Webhooks</Link>
            <Link href="/admin/submissions" className="text-sm text-gray-300 hover:text-white transition-colors">Submissions</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {children}
      </main>
    </div>
  );
}

