import React, { useState } from 'react';
import {
  Plus,
  Lock,
  Unlock,
  Copy,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { BankAccount } from '../types';

interface AccountsViewProps {
  accounts: BankAccount[];
  onOpenTransferModal: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onOpenTransferModal }) => {
  const [frozenCards, setFrozenCards] = useState<Record<string, boolean>>({});
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleFreeze = (id: string) => {
    setFrozenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNumberShow = (id: string) => {
    setShowNumbers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyNumber = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Salary, Savings Accounts & Payment Cards
          </h2>
          <p className="text-xs text-slate-500">
            Manage your linked Indian bank accounts, RuPay credit cards, and Fixed Deposit portfolios.
          </p>
        </div>

        <button
          onClick={onOpenTransferModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Self Transfer (NEFT/IMPS)</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {accounts.map((acc) => {
          const isFrozen = frozenCards[acc.id];
          const isNumVisible = showNumbers[acc.id];

          return (
            <div
              key={acc.id}
              className={`rounded-2xl p-5 text-white bg-gradient-to-br ${acc.cardColor} border border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[200px] transition-all duration-300 ${
                isFrozen ? 'opacity-60 saturate-50' : 'hover:scale-[1.01]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {acc.type}
                </span>
                <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-md">
                  ApexBank India
                </span>
              </div>

              {/* Card Number & Chip */}
              <div className="my-4 z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-6 bg-amber-400/80 rounded-md border border-amber-300/40" />
                  <button
                    onClick={() => toggleNumberShow(acc.id)}
                    className="text-slate-300 hover:text-white p-1 cursor-pointer"
                  >
                    {isNumVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm sm:text-base tracking-widest text-slate-100">
                    {isNumVisible ? acc.cardNumberMasked?.replace(/•/g, '4') : acc.cardNumberMasked}
                  </p>
                  <button
                    onClick={() => copyNumber(acc.id, acc.accountNumber)}
                    className="p-1 text-slate-300 hover:text-white cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedId === acc.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-end justify-between z-10 pt-2 border-t border-white/10">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-medium">Balance</span>
                  <span className="text-lg font-extrabold text-white">
                    {formatINR(acc.balance)}
                  </span>
                </div>

                <button
                  onClick={() => toggleFreeze(acc.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    isFrozen
                      ? 'bg-rose-500/80 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  {isFrozen ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{isFrozen ? 'Frozen' : 'Lock'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Details Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Account Portfolio & FD Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">Account Name</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Account No / VPA</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Available Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-2 font-bold text-slate-900">{acc.name}</td>
                  <td className="py-3.5 px-2 font-medium text-slate-600">{acc.type}</td>
                  <td className="py-3.5 px-2 font-mono text-slate-500">{acc.accountNumber}</td>
                  <td className="py-3.5 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-extrabold text-slate-900">
                    {formatINR(acc.balance)} {acc.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
