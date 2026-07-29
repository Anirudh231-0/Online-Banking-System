import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Award, DollarSign, PieChart as PieIcon } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const categoryData = [
    { name: 'Reliance & Groceries', value: 14500, color: '#4f46e5' },
    { name: 'Swiggy & Dining', value: 8500, color: '#10b981' },
    { name: 'Utilities & Jio Fiber', value: 5800, color: '#f59e0b' },
    { name: 'Croma Electronics', value: 14990, color: '#ec4899' },
    { name: 'Uber & Transport', value: 3400, color: '#06b6d4' },
  ];

  const monthlyComparisonData = [
    { month: 'Apr', 'Received Money': 145000, 'Sent Money': 46000 },
    { month: 'May', 'Received Money': 170000, 'Sent Money': 62000 },
    { month: 'Jun', 'Received Money': 160000, 'Sent Money': 49000 },
    { month: 'Jul', 'Received Money': 160000, 'Sent Money': 54000 },
  ];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Financial Analytics & Cashflow Intelligence
        </h2>
        <p className="text-xs text-slate-500">
          In-depth Indian Rupees analytics into your money received vs money sent and savings goals.
        </p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Monthly Savings Rate</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">66.25%</h3>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +5.8% higher than target
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Net Monthly Cashflow</span>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">+₹1,06,000.00</h3>
            <span className="text-[11px] text-slate-400 mt-1 block">Received money minus sent money</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Top Sent Category</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Croma Digital</h3>
            <span className="text-[11px] text-slate-500 mt-1 block">₹14,990.00 (27.7% of total)</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <PieIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Money Received vs Money Sent Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Received Money vs Sent Money</h3>
          <p className="text-xs text-slate-500 mb-4">Monthly comparison over last 4 months (in ₹)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip formatter={(val: number) => formatINR(val)} />
                <Bar dataKey="Received Money" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Sent Money" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Sent Money Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Current month expense category share</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => formatINR(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 font-medium truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
