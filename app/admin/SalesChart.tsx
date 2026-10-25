'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function SalesChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6E1F2E" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6E1F2E" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#5C6B3F" opacity={0.1} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#414D2C', fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#414D2C', fontSize: 12 }}
          tickFormatter={(value) => `৳${value}`}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          formatter={(value) => [`৳${value}`, 'Revenue']}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#6E1F2E" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}