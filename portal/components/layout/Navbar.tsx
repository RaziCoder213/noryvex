'use client';

interface NavbarProps {
  title: string;
  workspaceName?: string;
}

export default function Navbar({ title, workspaceName }: NavbarProps) {
  return (
    <header className="h-14 bg-[#111111] border-b border-[#222222] flex items-center justify-between px-6 shrink-0">
      <h2 className="text-white font-semibold text-lg">{title}</h2>
      <div className="flex items-center gap-4">
        {workspaceName && (
          <span className="text-xs font-medium bg-[#1a1a1a] border border-[#222222] text-[#a1a1aa] px-3 py-1 rounded-full">
            {workspaceName}
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-indigo-600 transition-colors">
          U
        </div>
      </div>
    </header>
  );
}

