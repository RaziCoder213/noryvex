'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Phone, Users, Calendar, BookOpen, 
  BarChart2, Settings, Building2, Globe, Mic, 
  Webhook, Inbox, LogOut 
} from 'lucide-react';

interface SidebarProps {
  activePath?: string;
  workspaceName?: string;
  isAdmin?: boolean;
}

export default function Sidebar({ activePath, workspaceName, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = activePath || pathname;

  const clientLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/calls', label: 'Calls', icon: Phone },
    { href: '/patients', label: 'Patients', icon: Users },
    { href: '/appointments', label: 'Appointments', icon: Calendar },
    { href: '/knowledge', label: 'Knowledge', icon: BookOpen },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/clients', label: 'Clients', icon: Building2 },
    { href: '/admin/workspaces', label: 'Workspaces', icon: Globe },
    { href: '/admin/vapi', label: 'Vapi', icon: Mic },
    { href: '/admin/webhooks', label: 'Webhooks', icon: Webhook },
    { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#111111] border-r border-[#222222] hidden md:flex flex-col transition-all duration-300">
      <div className="p-6 border-b border-[#222222]">
        <h1 className="text-xl font-bold text-white tracking-tight">
          NORY<span className="text-indigo-500">VEX</span>
        </h1>
        {workspaceName && (
          <p className="text-sm text-[#71717a] mt-1 truncate">{workspaceName}</p>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.href || currentPath.startsWith(link.href + '/');
            return (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-indigo-500 text-white' 
                      : 'text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#222222]">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-3 py-2 w-full text-left text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
}

