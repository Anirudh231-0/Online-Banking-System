import React, { useState } from 'react';
import {
  Briefcase,
  ShoppingBag,
  Tv,
  Coffee,
  DollarSign,
  Smartphone,
  Car,
  TrendingUp,
  Search,
  Plus,
  Download,
} from 'lucide-react';
import { Transaction } from '../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onAddTransaction,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Icon map
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return Briefcase;
      case 'ShoppingBag':
        return ShoppingBag;
      case 'Tv':
        return Tv;
      case 'Coffee':
        return Coffee;
      case 'Smartphone':
        return Smartphone;
      case 'Car':
        return Car;
      case 'TrendingUp':
        return TrendingUp;
      default:
        return DollarSign;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    return amount > 0 ? `+${formatted}` : `-${formatted}`;
  };

  const exportCSV = () => {
    const headers = ['Merchant,Category,Date,Amount (INR),Type\n'];
    const rows = transactions.map(
      (t) => `"${t.merchant}","${t.category}","${t.date}",${t.amount},"${t.type}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex_bank_statement_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Transactions</h3>
          <p className="text-xs text-slate-500">Activity across linked Salary & Savings accounts</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export button */}
          <button
            onClick={exportCSV}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            title="Download Statement CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add transaction modal button */}
          <button
            onClick={onAddTransaction}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search merchants, UPI IDs or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'income', label: 'Money Received' },
            { id: 'expense', label: 'Money Sent' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === item.id
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No transactions found matching your filter criteria.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const Icon = getIcon(tx.iconName);
            const isPositive = tx.amount > 0;

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
              >
                {/* Left: Merchant Icon & Details */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {tx.merchant}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-600">{tx.category}</span>
                      <span>•</span>
                      <span className="text-slate-400">{tx.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Status Badge */}
                <div className="text-right">
                  <span
                    className={`block text-xs sm:text-sm font-extrabold tracking-tight ${
                      isPositive ? 'text-emerald-600 font-bold' : 'text-slate-800'
                    }`}
                  >
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium capitalize block mt-0.5">
                    {tx.accountName || 'Salary Account'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <button
          onClick={() => {
            setSearchTerm('');
            setFilterType('all');
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View Complete Bank Statement ({transactions.length} entries)
        </button>
      </div>
    </div>
  );
};
