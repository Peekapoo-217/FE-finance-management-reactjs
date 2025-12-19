import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { transactionApi, walletApi, budgetCategoryApi, budgetApi, type Transaction, type Wallet, type BudgetCategory, type Budget } from '../services/api';

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, walletsData, categoriesData, budgetsData] = await Promise.all([
        transactionApi.getAll(),
        walletApi.getAll(),
        budgetCategoryApi.getAll(),
        budgetApi.getAll()
      ]);
      setTransactions(transactionsData);
      setWallets(walletsData);
      setCategories(categoriesData);
      setBudgets(budgetsData);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    loading,
    transactions,
    wallets,
    categories,
    budgets,
    refetch: loadData,
  };
}

