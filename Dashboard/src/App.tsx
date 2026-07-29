/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { QuickActions } from './components/QuickActions';
import { SpendingChart } from './components/SpendingChart';
import { RecentTransactions } from './components/RecentTransactions';
import { GoalsAndBills } from './components/GoalsAndBills';
import { ActionModals } from './components/ActionModals';
import { AccountsView } from './components/AccountsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SecurityView } from './components/SecurityView';
import { SettingsView } from './components/SettingsView';

import {
  NavigationTab,
  ModalType,
  UserProfile,
  BankAccount,
  Transaction,
  SpendingDataPoint,
  SavingsGoal,
  UpcomingBill,
  NotificationItem,
} from './types';

import {
  initialUserProfile,
  initialAccounts,
  initialTransactions,
  monthlySpendingData,
  initialSavingsGoals,
  initialUpcomingBills,
  initialNotifications,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Core App States
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [spendingData] = useState<SpendingDataPoint[]>(monthlySpendingData);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>(initialUpcomingBills);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Computed metrics
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Helper to append a notification
  const notify = (title: string, message: string, type: 'alert' | 'info' | 'success' = 'info') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handlers
  const handlePayBill = (billId: string) => {
    const bill = upcomingBills.find((b) => b.id === billId);
    if (!bill || bill.isPaid) return;

    // Mark paid
    setUpcomingBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, isPaid: true } : b))
    );

    // Deduct from primary checking
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === 'acc-1' ? { ...acc, balance: acc.balance - bill.amount } : acc
      )
    );

    // Record transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      merchant: bill.title,
      category: bill.category,
      date: 'Today',
      amount: -bill.amount,
      type: 'expense',
      status: 'completed',
      iconName: 'ShoppingBag',
      accountName: 'Premier Checking',
    };
    setTransactions((prev) => [newTx, ...prev]);

    notify('Bill Paid Successfully', `Paid $${bill.amount.toFixed(2)} for ${bill.title}.`, 'success');
  };

  const handleAddFundsToGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === 'acc-1' ? { ...acc, balance: acc.balance - amount } : acc
      )
    );

    const goal = savingsGoals.find((g) => g.id === goalId);
    notify('Savings Deposit', `Deposited $${amount} into ${goal?.title || 'Savings Goal'}.`, 'success');
  };

  const handleSendMoney = (recipient: string, amount: number, accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, balance: acc.balance - amount } : acc))
    );

    const targetAcc = accounts.find((a) => a.id === accountId);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      merchant: `Transfer to ${recipient}`,
      category: 'Zelle Wire',
      date: 'Today',
      amount: -amount,
      type: 'expense',
      status: 'completed',
      iconName: 'DollarSign',
      accountName: targetAcc?.name || 'Premier Checking',
    };
    setTransactions((prev) => [newTx, ...prev]);

    notify('Money Sent', `Sent $${amount.toFixed(2)} to ${recipient}.`, 'success');
  };

  const handlePayBillCustom = (billerName: string, amount: number, accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, balance: acc.balance - amount } : acc))
    );

    const targetAcc = accounts.find((a) => a.id === accountId);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      merchant: billerName,
      category: 'Bill Payment',
      date: 'Today',
      amount: -amount,
      type: 'expense',
      status: 'completed',
      iconName: 'Tv',
      accountName: targetAcc?.name || 'Premier Checking',
    };
    setTransactions((prev) => [newTx, ...prev]);

    notify('Bill Processed', `Paid $${amount.toFixed(2)} to ${billerName}.`, 'success');
  };

  const handleTransfer = (fromAccId: string, toAccId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromAccId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toAccId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    const fromAcc = accounts.find((a) => a.id === fromAccId);
    const toAcc = accounts.find((a) => a.id === toAccId);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      merchant: `Transfer to ${toAcc?.name}`,
      category: 'Account Transfer',
      date: 'Today',
      amount: -amount,
      type: 'expense',
      status: 'completed',
      iconName: 'DollarSign',
      accountName: fromAcc?.name || 'Premier Checking',
    };
    setTransactions((prev) => [newTx, ...prev]);

    notify('Transfer Complete', `Moved $${amount.toFixed(2)} from ${fromAcc?.name} to ${toAcc?.name}.`, 'info');
  };

  const handleExchangeCurrency = (fromCurrency: string, toCurrency: string, amount: number) => {
    notify('Currency Conversion Locked', `Exchanged $${amount.toFixed(2)} ${fromCurrency} to ${toCurrency}.`, 'info');
  };

  const handleAddNewTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.name === newTxData.accountName) {
          return { ...acc, balance: acc.balance + newTxData.amount };
        }
        return acc;
      })
    );

    notify('Transaction Logged', `Recorded ${newTxData.merchant} (${newTxData.amount > 0 ? '+' : ''}$${newTxData.amount}).`, 'success');
  };

  const handleAddNewGoal = (newGoalData: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
      currentAmount: 0,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    notify('New Savings Target', `Created goal "${newGoal.title}".`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onLogout={() => {
          alert('Logged out securely. Demo session reset.');
        }}
      />

      {/* Main Workspace Layout offset for fixed sidebar on lg screens */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <Header
          user={user}
          notifications={notifications}
          setNotifications={setNotifications}
          setIsOpenMobile={setIsOpenMobile}
          onOpenQuickAction={(modalType) => setActiveModal(modalType)}
        />

        {/* Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: DASHBOARD (MAIN VIEW) */}
          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: Top Metric Cards */}
              <MetricCards
                balance={totalBalance}
                income={monthlyIncome > 0 ? monthlyIncome : 4200.00}
                expenses={monthlyExpenses > 0 ? monthlyExpenses : 1850.20}
                creditScore={user.creditScore}
                creditRating={user.creditRating}
                onViewCreditDetails={() => setActiveTab('analytics')}
              />

              {/* Row 2: Responsive 3-Column Grid Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/Middle Column (Spans 2 columns on desktop) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Actions Grid */}
                  <QuickActions onOpenModal={(modalType) => setActiveModal(modalType)} />

                  {/* Spending Trend Chart */}
                  <SpendingChart data={spendingData} />

                  {/* Recent Transactions List */}
                  <RecentTransactions
                    transactions={transactions}
                    onAddTransaction={() => setActiveModal('add_transaction')}
                  />
                </div>

                {/* Right Column (1 column on desktop) */}
                <div className="lg:col-span-1 space-y-6">
                  <GoalsAndBills
                    goals={savingsGoals}
                    bills={upcomingBills}
                    onPayBill={handlePayBill}
                    onAddFundsToGoal={handleAddFundsToGoal}
                    onOpenAddGoalModal={() => setActiveModal('add_goal')}
                  />
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ACCOUNTS VIEW */}
          {activeTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              onOpenTransferModal={() => setActiveModal('transfer')}
            />
          )}

          {/* TAB 3: ANALYTICS VIEW */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* TAB 4: SECURITY VIEW */}
          {activeTab === 'security' && <SecurityView />}

          {/* TAB 5: SETTINGS VIEW */}
          {activeTab === 'settings' && <SettingsView user={user} setUser={setUser} />}
        </main>
      </div>

      {/* Global Interactive Quick Action Modals */}
      <ActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        accounts={accounts}
        onSendMoney={handleSendMoney}
        onPayBillCustom={handlePayBillCustom}
        onTransfer={handleTransfer}
        onExchangeCurrency={handleExchangeCurrency}
        onAddNewTransaction={handleAddNewTransaction}
        onAddNewGoal={handleAddNewGoal}
      />
    </div>
  );
}
