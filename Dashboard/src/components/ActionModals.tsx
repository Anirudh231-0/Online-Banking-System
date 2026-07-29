import React, { useState } from 'react';
import {
  X,
  Send,
  Receipt,
  ArrowLeftRight,
  RefreshCw,
  CheckCircle2,
  Plus,
  UserCheck,
  Building2,
} from 'lucide-react';
import { ModalType, BankAccount, Transaction, SavingsGoal } from '../types';
import { exchangeRates } from '../data/mockData';

interface ActionModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  accounts: BankAccount[];
  onSendMoney: (recipient: string, amount: number, accountId: string) => void;
  onPayBillCustom: (billerName: string, amount: number, accountId: string) => void;
  onTransfer: (fromAccId: string, toAccId: string, amount: number) => void;
  onExchangeCurrency: (fromCurrency: string, toCurrency: string, amount: number) => void;
  onAddNewTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onAddNewGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
}

export const ActionModals: React.FC<ActionModalsProps> = ({
  activeModal,
  onClose,
  accounts,
  onSendMoney,
  onPayBillCustom,
  onTransfer,
  onExchangeCurrency,
  onAddNewTransaction,
  onAddNewGoal,
}) => {
  if (!activeModal) return null;

  // Form states
  const [recipient, setRecipient] = useState('priya.sharma@okaxis');
  const [amount, setAmount] = useState('2500');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [targetAccount, setTargetAccount] = useState(accounts[1]?.id || '');
  const [billerName, setBillerName] = useState('Tata Power / BESCOM Electricity');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Add Transaction states
  const [txMerchant, setTxMerchant] = useState('');
  const [txCategory, setTxCategory] = useState('Groceries');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');

  // Add Goal states
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('100000');
  const [goalCategory, setGoalCategory] = useState('Festive');
  const [goalDate, setGoalDate] = useState('Nov 2026');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    onSendMoney(recipient, num, selectedAccount);
    setSuccessMsg(`Successfully sent ${formatINR(num)} via UPI to ${recipient}!`);
    setIsSuccess(true);
  };

  const handlePayBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    onPayBillCustom(billerName, num, selectedAccount);
    setSuccessMsg(`Payment of ${formatINR(num)} to ${billerName} processed successfully.`);
    setIsSuccess(true);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    if (selectedAccount === targetAccount) return;

    onTransfer(selectedAccount, targetAccount, num);
    setSuccessMsg(`Transferred ${formatINR(num)} between accounts via NEFT/IMPS!`);
    setIsSuccess(true);
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const rateObj = exchangeRates.find((r) => r.code === toCurrency);
    const converted = (num / (rateObj?.rate || 83.5)).toFixed(2);

    onExchangeCurrency(fromCurrency, toCurrency, num);
    setSuccessMsg(`Exchanged ${formatINR(num)} to ${rateObj?.symbol || ''}${converted} ${toCurrency}!`);
    setIsSuccess(true);
  };

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(txAmount);
    if (!txMerchant || isNaN(num) || num <= 0) return;

    onAddNewTransaction({
      merchant: txMerchant,
      category: txCategory,
      date: 'Just now',
      amount: txType === 'expense' ? -num : num,
      type: txType,
      status: 'completed',
      iconName: txType === 'income' ? 'TrendingUp' : 'ShoppingBag',
      accountName: accounts.find((a) => a.id === selectedAccount)?.name || 'Salary Account (HDFC Bank)',
    });

    setSuccessMsg(`Added new ${txType === 'income' ? 'Money Received' : 'Money Sent'} entry for ${txMerchant}!`);
    setIsSuccess(true);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(goalTarget);
    if (!goalTitle || isNaN(targetNum) || targetNum <= 0) return;

    onAddNewGoal({
      title: goalTitle,
      targetAmount: targetNum,
      category: goalCategory,
      targetDate: goalDate,
      color: 'bg-indigo-600',
    });

    setSuccessMsg(`Created new savings target: "${goalTitle}" for ${formatINR(targetNum)}!`);
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setSuccessMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {activeModal === 'send' && <Send className="w-5 h-5 text-indigo-400" />}
            {activeModal === 'pay' && <Receipt className="w-5 h-5 text-emerald-400" />}
            {activeModal === 'transfer' && <ArrowLeftRight className="w-5 h-5 text-blue-400" />}
            {activeModal === 'exchange' && <RefreshCw className="w-5 h-5 text-purple-400" />}
            {activeModal === 'add_transaction' && <Plus className="w-5 h-5 text-amber-400" />}
            {activeModal === 'add_goal' && <Plus className="w-5 h-5 text-cyan-400" />}

            <h3 className="font-bold text-base capitalize">
              {activeModal === 'send' && 'Send Money via UPI / IMPS'}
              {activeModal === 'pay' && 'UPI Bill Payment (BBPS)'}
              {activeModal === 'transfer' && 'Self Account Transfer (NEFT)'}
              {activeModal === 'exchange' && 'Forex Currency Conversion'}
              {activeModal === 'add_transaction' && 'Log Money Entry (Received / Sent)'}
              {activeModal === 'add_goal' && 'Create Savings Goal / FD Target'}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Transaction Confirmed!</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">{successMsg}</p>
              <button
                onClick={resetAndClose}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* SEND MONEY FORM */}
              {activeModal === 'send' && (
                <form onSubmit={handleSendSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recipient UPI ID / VPA or Mobile Number
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="e.g. priya@okaxis or 9876543210"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Debit Account
                    </label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({formatINR(acc.balance)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Amount (₹ INR)
                    </label>
                    <div className="relative">
                      <span className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-bold text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      UPI Payment Remark
                    </label>
                    <input
                      type="text"
                      placeholder="Lunch, split bill, rent, etc."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-2 cursor-pointer"
                  >
                    Send ₹{amount || '0'} via UPI Now
                  </button>
                </form>
              )}

              {/* PAY BILLS FORM */}
              {activeModal === 'pay' && (
                <form onSubmit={handlePayBillSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Biller / Service Provider
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={billerName}
                        onChange={(e) => setBillerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pay From Account
                    </label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-medium"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({formatINR(acc.balance)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Payment Amount (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-2 cursor-pointer"
                  >
                    Confirm Bill Payment
                  </button>
                </form>
              )}

              {/* TRANSFER FORM */}
              {activeModal === 'transfer' && (
                <form onSubmit={handleTransferSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      From Account
                    </label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({formatINR(acc.balance)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      To Account
                    </label>
                    <select
                      value={targetAccount}
                      onChange={(e) => setTargetAccount(e.target.value)}
                      className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({formatINR(acc.balance)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Transfer Amount (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-2 cursor-pointer"
                  >
                    Execute NEFT/IMPS Transfer
                  </button>
                </form>
              )}

              {/* CURRENCY EXCHANGE FORM */}
              {activeModal === 'exchange' && (
                <form onSubmit={handleExchangeSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        From Currency
                      </label>
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900"
                      >
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        To Currency
                      </label>
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900"
                      >
                        {exchangeRates.map((r) => (
                          <option key={r.code} value={r.code}>
                            {r.code} ({r.symbol}) - 1 {r.code} = ₹{r.rate}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Amount in INR (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 flex justify-between items-center">
                    <span>Estimated Forex Output:</span>
                    <span className="font-bold text-sm">
                      {exchangeRates.find((r) => r.code === toCurrency)?.symbol}
                      {((parseFloat(amount) || 0) / (exchangeRates.find((r) => r.code === toCurrency)?.rate || 83.5)).toFixed(2)}{' '}
                      {toCurrency}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-2 cursor-pointer"
                  >
                    Convert & Lock Forex Rate
                  </button>
                </form>
              )}

              {/* ADD MANUAL TRANSACTION FORM */}
              {activeModal === 'add_transaction' && (
                <form onSubmit={handleAddTxSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Merchant / Sender / Recipient
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swiggy, Reliance Smart, TCS Salary"
                      value={txMerchant}
                      onChange={(e) => setTxMerchant(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Type
                      </label>
                      <select
                        value={txType}
                        onChange={(e) => setTxType(e.target.value as any)}
                        className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 font-medium"
                      >
                        <option value="expense">Money Sent (-)</option>
                        <option value="income">Money Received (+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={txCategory}
                        onChange={(e) => setTxCategory(e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 font-medium"
                      >
                        <option value="Groceries & Home">Groceries & Home</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Utilities & Bills">Utilities & Bills</option>
                        <option value="Electronics">Electronics</option>
                        <option value="UPI Received">UPI Received</option>
                        <option value="Salary Deposit">Salary Deposit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Amount (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      placeholder="0.00"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-2 cursor-pointer"
                  >
                    Save Entry
                  </button>
                </form>
              )}

              {/* ADD SAVINGS GOAL FORM */}
              {activeModal === 'add_goal' && (
                <form onSubmit={handleAddGoalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Goal Title / FD Purpose
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diwali Gold & Gifts, Emergency Fund"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Target Amount (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Target Date
                      </label>
                      <input
                        type="text"
                        placeholder="Nov 2026"
                        value={goalDate}
                        onChange={(e) => setGoalDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-all shadow-md text-sm mt-2 cursor-pointer"
                  >
                    Create Savings Goal
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
