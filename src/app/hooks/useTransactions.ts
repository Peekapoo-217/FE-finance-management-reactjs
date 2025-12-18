import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { transactionApi, walletApi, budgetCategoryApi, type Transaction, type Wallet, type BudgetCategory } from '../services/api';

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, walletsData, categoriesData] = await Promise.all([
        transactionApi.getAll(),
        walletApi.getAll(),
        budgetCategoryApi.getAll()
      ]);
      setTransactions(transactionsData);
      setWallets(walletsData);
      setCategories(categoriesData);
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
    refetch: loadData,
  };
}

