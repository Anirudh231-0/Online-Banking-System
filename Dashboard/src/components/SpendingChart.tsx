import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { SpendingDataPoint } from '../types';

interface SpendingChartProps {
  data: SpendingDataPoint[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [activeMetric, setActiveMetric] = useState<'spending' | 'income' | 'savings'>('spending');

  const metricConfig = {
    spending: {
      label: 'Money Sent',
      gradientStart: '#6366f1', // Indigo 500
      gradientStop: '#818cf8',
      stroke: '#4f46e5',
      badgeBg: 'bg-indigo-50 text-indigo-700',
    },
    income: {
      label: 'Money Received',
      gradientStart: '#10b981', // Emerald 500
      gradientStop: '#34d399',
      stroke: '#059669',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
    savings: {
      label: 'Savings',
      gradientStart: '#3b82f6', // Blue 500
      gradientStop: '#60a5fa',
      stroke: '#2563eb',
      badgeBg: 'bg-blue-50 text-blue-700',
    },
  };

  const activeColor = metricConfig[activeMetric];

  const totalSpending = data.reduce((acc, item) => acc + item[activeMetric], 0);
  const avgMonthly = Math.round(totalSpending / (data.length || 1));

  const formatINR = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-800 text-xs font-medium">
          <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-400" />
            {label} 2026
          </p>
          <div className="flex items-center gap-2">
            <span className="capitalize text-slate-300">{activeColor.label}:</span>
            <span className="text-sm font-bold text-white">
              {formatINR(val)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Monthly Financial Trend
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${activeColor.badgeBg}`}>
              {activeColor.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Avg. {formatINR(avgMonthly)}/mo • Total {formatINR(totalSpending)} ({timeRange})
          </p>
        </div>

        {/* Controls: Metric Selector & Time Range */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['spending', 'income', 'savings'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeMetric === m
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {metricConfig[m].label}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
            {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="softGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeColor.gradientStart} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeColor.gradientStop} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => `₹${value >= 1000 ? `${value / 1000}k` : value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={activeColor.stroke}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#softGradient)"
              activeDot={{ r: 6, fill: activeColor.stroke, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium text-emerald-600">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Money Sent is 12.4% well within your monthly UPI budget.
        </span>
        <span className="hidden sm:inline text-slate-400">Updated today at 09:00 AM IST</span>
      </div>
    </div>
  );
};
