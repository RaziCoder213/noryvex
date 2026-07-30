import React from 'react';

interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#222222] text-[#e4e4e7]',
    success: 'bg-[#22c55e]/10 text-[#22c55e]',
    warning: 'bg-[#f59e0b]/10 text-[#f59e0b]',
    danger: 'bg-[#ef4444]/10 text-[#ef4444]',
    info: 'bg-indigo-500/10 text-indigo-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

