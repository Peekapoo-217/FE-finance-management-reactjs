import React, { useState, useEffect } from "react";
import { Card } from "../ui/layout/card";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { transactionApi, budgetApi, walletApi, type Transaction, type Budget } from "../../services/api";
import { toast } from "sonner";

interface DashboardProps {
  refreshTrigger?: number;
}

// Progress Bar Component - using CSS variable approach
function ProgressBar({ percentage, isWarning }: { percentage: number; isWarning: boolean }) {
  const colorClass = percentage >= 100 ? 'bg-red-600' : 
                     percentage >= 80 ? 'bg-orange-500' : 
                     'bg-green-500';
  const width = `${Math.min(percentage, 100)}%`;
  const barId = `progress-bar-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <>
      <style>{`
        #${barId} {
          --progress-width: ${width};
        }
      `}</style>
      <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
        <div
          id={barId}
          className={`h-2 rounded-full transition-all progress-bar-fill ${colorClass}`}
        />
      </div>
    </>
  );
}

export function Dashboard({ refreshTrigger }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalWalletBalance, setTotalWalletBalance] = useState(0);

  useEffect(() => {
    loadData();
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
      setTotalWalletBalance(walletsData.reduce((sum, w) => sum + Number(w.balance), 0));
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán tổng thu/chi
  const totalIncome = transactions
    .filter(t => t.category?.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.category?.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Dữ liệu cho biểu đồ Pie - Chi tiêu theo hạng mục
  const categoryData = transactions
    .filter(t => t.category?.type === 'expense')
    .reduce((acc: any, t) => {
      const categoryName = t.category?.name || 'Khác';
      const existing = acc.find((item: any) => item.name === categoryName);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({ name: categoryName, value: Number(t.amount) });
      }
      return acc;
    }, []);

  // Dữ liệu cho biểu đồ Bar - Chi tiêu theo tháng (3 tháng gần nhất)
  const monthlyData = React.useMemo(() => {
    const now = new Date();
    const months: Array<{ month: string; income: number; expense: number }> = [];
    
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `T${date.getMonth() + 1}`;
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.transactionDate);
        return tDate.getFullYear() === date.getFullYear() && 
               tDate.getMonth() === date.getMonth();
      });
      
      const income = monthTransactions
        .filter(t => t.category?.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expense = monthTransactions
        .filter(t => t.category?.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      months.push({ month: monthLabel, income, expense });
    }
    
    return months;
  }, [transactions]);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // Kiểm tra cảnh báo ngân sách
  const budgetAlerts = budgets.filter(budget => {
    const percentage = (Number(budget.spentAmount) / Number(budget.limitAmount)) * 100;
    return percentage >= 80;
  });

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
      {/* Thông báo cảnh báo */}
      {budgetAlerts.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="text-orange-400 mr-3" size={24} />
            <div>
              <p className="font-medium text-orange-800">Cảnh báo ngân sách!</p>
              <p className="text-orange-700">
                Bạn đã chi tiêu vượt 80% ngân sách cho: {budgetAlerts.map(b => b.category?.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tổng quan tài chính */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Tổng thu nhập</p>
              <p className="text-2xl text-green-600 mt-2">
                {totalIncome.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Tổng chi tiêu</p>
              <p className="text-2xl text-red-600 mt-2">
                {totalExpense.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Tổng số dư ví</p>
              <p className={`text-2xl mt-2 ${totalWalletBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {totalWalletBalance.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ Pie - Chi tiêu theo hạng mục */}
        <Card className="p-6">
          <h3 className="mb-4">Chi tiêu theo hạng mục</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / totalExpense) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')} ₫`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Chưa có dữ liệu chi tiêu
            </div>
          )}
        </Card>

        {/* Biểu đồ Bar - Thu/Chi theo tháng */}
        <Card className="p-6">
          <h3 className="mb-4">Thu/Chi theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')} ₫`} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Thu nhập" />
              <Bar dataKey="expense" fill="#ef4444" name="Chi tiêu" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Ngân sách */}
      <Card className="p-6">
        <h3 className="mb-4">Tình trạng ngân sách</h3>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const spent = Number(budget.spentAmount);
            const limit = Number(budget.limitAmount);
            const percentage = Math.min((spent / limit) * 100, 100);
            const isWarning = percentage >= 80;

            return (
              <div key={budget.id}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{budget.category?.name || 'N/A'}</span>
                  <span className={isWarning ? 'text-orange-600' : 'text-gray-600'}>
                    {spent.toLocaleString('vi-VN')} / {limit.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <ProgressBar percentage={percentage} isWarning={isWarning} />
              </div>
            );
          })}
          {budgets.length === 0 && (
            <p className="text-gray-400 text-center py-4">Chưa có ngân sách nào được thiết lập</p>
          )}
        </div>
      </Card>
    </div>
  );
}

