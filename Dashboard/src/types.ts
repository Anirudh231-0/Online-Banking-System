export type NavigationTab = 'dashboard' | 'accounts' | 'analytics' | 'security' | 'settings';

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
  iconName: string;
  accountName?: string;
}

export interface SpendingDataPoint {
  month: string;
  spending: number;
  income: number;
  savings: number;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'Checking' | 'Savings' | 'Credit Card' | 'Investment';
  accountNumber: string;
  balance: number;
  currency: string;
  cardColor: string;
  expiry?: string;
  cardNumberMasked?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  category: string;
  targetDate: string;
  color: string;
}

export interface UpcomingBill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: string;
  alertType: 'urgent' | 'warning' | 'normal';
  isPaid: boolean;
  providerLogo?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  lastLogin: string;
  creditScore: number;
  creditRating: string;
  membershipTier: string;
}

export type ModalType = 'send' | 'pay' | 'transfer' | 'exchange' | 'add_transaction' | 'add_goal' | null;
