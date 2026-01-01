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
      // Load transactions và wallets (bắt buộc)
      const [transactionsData, walletsData] = await Promise.all([
        transactionApi.getAll(),
        walletApi.getAll(),
      ]);
      setTransactions(transactionsData);
      setWallets(walletsData);

      // Load categories from Budget Service (optional)
      try {
        const categoriesData = await budgetCategoryApi.getAll();
        setCategories(categoriesData);
      } catch (categoryError: any) {
        console.warn('Cannot load budget categories (Budget Service may be down):', categoryError.message);
        setCategories([]); // Empty - dùng categories từ Transaction Service nếu cần
      }

      // Load budgets (optional)
      try {
        const budgetsData = await budgetApi.getAll();
        setBudgets(budgetsData);
      } catch (budgetError: any) {
        console.warn('Cannot load budgets (Budget Service may be down):', budgetError.message);
        setBudgets([]);
      }
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

