import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { walletApi, type Wallet } from '../services/api';

export function useWallets() {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const walletsData = await walletApi.getAll();
      setWallets(walletsData);
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
    wallets,
    refetch: loadData,
  };
}

