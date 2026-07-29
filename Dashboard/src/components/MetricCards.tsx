import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

interface MetricCardsProps {
  balance?: number;
  income?: number;
  expenses?: number;
  creditScore?: number;
  creditRating?: string;
  onViewCreditDetails?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  balance = 184500.80,
  income = 160000.00,
  expenses = 54000.00,
  creditScore = 785,
  creditRating = 'Excellent (CIBIL)',
  onViewCreditDetails,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* 1. Total Balance Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Balance
            </span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {showBalance ? formatINR(balance) : '••••••••'}
            </h2>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              +4.8% this month
            </span>
            <span className="text-[11px] text-slate-400 font-medium">vs last cycle</span>
          </div>
        </div>
      </div>

      {/* 2. Received Money Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Received Money
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(income)}
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              +₹35,000 via NEFT & UPI
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sent Money Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Sent Money
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(expenses)}
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
              <TrendingDown className="w-3.5 h-3.5" />
              -11.5% optimized spend
            </span>
          </div>
        </div>
      </div>

      {/* 4. CIBIL Score Card */}
      <div
        onClick={onViewCreditDetails}
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              CIBIL Score
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
            CIBIL® Score
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {creditScore} <span className="text-sm font-semibold text-emerald-600">- {creditRating}</span>
            </h2>
          </div>

          {/* CIBIL score gauge (300 - 900 range) */}
          <div className="mt-3">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex relative p-0.5">
              <div className="w-1/4 h-full bg-rose-400 rounded-l-full" />
              <div className="w-1/4 h-full bg-amber-400" />
              <div className="w-1/4 h-full bg-blue-400" />
              <div className="w-1/4 h-full bg-emerald-500 rounded-r-full" />
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-slate-900 rounded-full ring-2 ring-white shadow transition-all duration-500"
                style={{ left: `${Math.min(Math.max(((creditScore - 300) / 600) * 100, 5), 95)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
              <span>300 (Poor)</span>
              <span>900 (Excellent)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
