import React, { useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import {
  calculateTotalIncome,
  calculateTotalExpense,
  calculateTotalWalletBalance,
} from "../../utils/calculations";
import { StatCard } from "../common/StatCard";
import { BudgetList } from "../common/BudgetList";

interface DashboardProps {
  refreshTrigger?: number;
}

export function Dashboard({ refreshTrigger }: DashboardProps) {
  const { loading, transactions, budgets, wallets } = useDashboard(refreshTrigger);

  const totalIncome = useMemo(() => calculateTotalIncome(transactions), [transactions]);
  const totalExpense = useMemo(() => calculateTotalExpense(transactions), [transactions]);
  const totalWalletBalance = useMemo(() => calculateTotalWalletBalance(wallets), [wallets]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin mr-2" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Tổng thu nhập"
          value={`${totalIncome.toLocaleString('vi-VN')} ₫`}
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
        <StatCard
          title="Tổng chi tiêu"
          value={`${totalExpense.toLocaleString('vi-VN')} ₫`}
          icon={TrendingDown}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
        <StatCard
          title="Tổng số dư ví"
          value={`${totalWalletBalance.toLocaleString('vi-VN')} ₫`}
          icon={Wallet}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          valueColor={totalWalletBalance >= 0 ? 'text-blue-600' : 'text-red-600'}
        />
      </div>



      <BudgetList budgets={budgets} />
    </div>
  );
}

