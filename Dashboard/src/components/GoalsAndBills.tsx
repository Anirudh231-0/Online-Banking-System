import React, { useState } from 'react';
import {
  Target,
  Plus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { SavingsGoal, UpcomingBill } from '../types';

interface GoalsAndBillsProps {
  goals: SavingsGoal[];
  bills: UpcomingBill[];
  onPayBill: (billId: string) => void;
  onAddFundsToGoal: (goalId: string, amount: number) => void;
  onOpenAddGoalModal?: () => void;
}

export const GoalsAndBills: React.FC<GoalsAndBillsProps> = ({
  goals,
  bills,
  onPayBill,
  onAddFundsToGoal,
  onOpenAddGoalModal,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || '');
  const activeGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* 1. Savings Goals Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Savings Goals & FDs</h3>
              <p className="text-[11px] text-slate-500">Automated Indian Rupee targets</p>
            </div>
          </div>

          <button
            onClick={onOpenAddGoalModal}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Create New Savings Goal"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Goal</span>
          </button>
        </div>

        {/* Goal Tabs if multiple goals */}
        {goals.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
            {goals.map((g) => {
              const isActive = g.id === (activeGoal?.id || '');
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoalId(g.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g.title.split('(')[0]}
                </button>
              );
            })}
          </div>
        )}

        {/* Primary Goal Details */}
        {activeGoal && (
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{activeGoal.title}</h4>
                <span className="text-[11px] text-slate-500">Target date: {activeGoal.targetDate}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100)}% Reached
              </span>
            </div>

            {/* Target Amounts */}
            <div className="flex items-baseline justify-between mt-3 mb-2">
              <span className="text-lg font-extrabold text-slate-900">
                {formatINR(activeGoal.currentAmount)}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Target: {formatINR(activeGoal.targetAmount)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden relative mb-3">
              <div
                className={`h-full ${activeGoal.color || 'bg-indigo-600'} rounded-full transition-all duration-500`}
                style={{
                  width: `${Math.min(
                    (activeGoal.currentAmount / activeGoal.targetAmount) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            {/* Quick Add Funds CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                +₹5,000 monthly SIP auto-debit
              </span>
              <button
                onClick={() => onAddFundsToGoal(activeGoal.id, 5000)}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors cursor-pointer"
              >
                + ₹5,000 Quick Deposit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Upcoming Bills Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Utility Bills</h3>
              <p className="text-[11px] text-slate-500">BBPS & UPI Auto-pay dues</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
            {bills.filter((b) => !b.isPaid).length} Pending
          </span>
        </div>

        {/* Bill Items List */}
        <div className="space-y-3">
          {bills.map((bill) => {
            const isUrgent = bill.alertType === 'urgent' && !bill.isPaid;
            const isWarning = bill.alertType === 'warning' && !bill.isPaid;

            return (
              <div
                key={bill.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  bill.isPaid
                    ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                    : isUrgent
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : isWarning
                    ? 'bg-orange-50/50 border-orange-200'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        bill.isPaid
                          ? 'bg-emerald-100 text-emerald-700'
                          : isUrgent
                          ? 'bg-amber-200/80 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {bill.isPaid ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Calendar className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {bill.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[11px] font-semibold ${
                            isUrgent
                              ? 'text-amber-800 font-bold'
                              : bill.isPaid
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {bill.isPaid ? 'Paid' : `Due ${bill.dueDate}`}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-500">{bill.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs sm:text-sm font-extrabold text-slate-900">
                      ₹{bill.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {!bill.isPaid ? (
                      <button
                        onClick={() => onPayBill(bill.id)}
                        className={`mt-1 text-[11px] px-2.5 py-1 font-bold rounded-lg transition-colors shadow-2xs cursor-pointer ${
                          isUrgent
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        UPI Pay Now
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1">
                        <CheckCircle2 className="w-3 h-3" /> Paid via UPI
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
