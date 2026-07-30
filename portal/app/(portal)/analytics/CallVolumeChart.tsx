"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CallVolumeChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMissed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
          <XAxis dataKey="date" stroke="#666666" tick={{fill: '#666666', fontSize: 12}} tickLine={false} axisLine={false} />
          <YAxis stroke="#666666" tick={{fill: '#666666', fontSize: 12}} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111111', borderColor: '#222222', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="answered" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAnswered)" />
          <Area type="monotone" dataKey="missed" stroke="#ef4444" fillOpacity={1} fill="url(#colorMissed)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

