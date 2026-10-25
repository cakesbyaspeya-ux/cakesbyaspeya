'use client';

import { useState } from 'react';
import { SalesChart } from './SalesChart';

export function RevenueChart({ data7, data30 }: { data7: any[]; data30: any[] }) {
  const [range, setRange] = useState<7 | 30>(7);

  return (
    <div className="lg:col-span-2 rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-ink">Revenue</h2>
        
        {/* Toggle Buttons */}
        <div className="flex rounded-lg bg-cream-dark p-1">
          <button
            onClick={() => setRange(7)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              range === 7 ? 'bg-white shadow-sm text-burgundy' : 'text-olive-dark hover:text-ink'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange(30)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              range === 30 ? 'bg-white shadow-sm text-burgundy' : 'text-olive-dark hover:text-ink'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>
      
      <div className="h-[250px] w-full flex-1">
        <SalesChart data={range === 7 ? data7 : data30} isMonth={range === 30} />
      </div>
    </div>
  );
}