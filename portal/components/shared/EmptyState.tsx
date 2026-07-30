import { Inbox } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-12 flex flex-col items-center justify-center text-center">
      <div className="text-[#71717a] mb-4">
        {icon || <Inbox className="w-12 h-12 stroke-[1.5]" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#a1a1aa] text-sm max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

