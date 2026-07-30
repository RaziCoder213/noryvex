"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function SentimentChart({ data }: { data: any[] }) {
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#111111', borderColor: '#222222', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

