'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color = 'default' 
}: StatCardProps) {
  const colorStyles = {
    default: 'bg-indigo-500/10 text-indigo-500',
    success: 'bg-[#22c55e]/10 text-[#22c55e]',
    warning: 'bg-[#f59e0b]/10 text-[#f59e0b]',
    danger: 'bg-[#ef4444]/10 text-[#ef4444]',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] border border-[#222222] rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#a1a1aa] font-medium text-sm">{title}</h3>
        {icon && (
          <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
            {icon}
          </div>
        )}
      </div>

      
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl font-bold text-white">{value}</h2>
        {trend && change && (
          <div className={`flex items-center text-xs font-medium ${
            trend === 'up' ? 'text-[#22c55e]' : 
            trend === 'down' ? 'text-[#ef4444]' : 
            'text-[#71717a]'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
            {change}
          </div>
        )}
      </div>
    </motion.div>
  );
}

