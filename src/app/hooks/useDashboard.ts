import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { transactionApi, budgetApi, walletApi, type Transaction, type Budget, type Wallet } from '../services/api';

export function useDashboard(refreshTrigger?: number) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, budgetsData, walletsData] = await Promise.all([
        transactionApi.getAll(),
        budgetApi.getAll(),
        walletApi.getAll()
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setWallets(walletsData);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    transactions,
    budgets,
    wallets,
    refetch: loadData,
  };
}

