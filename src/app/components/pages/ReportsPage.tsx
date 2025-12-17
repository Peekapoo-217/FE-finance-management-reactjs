import React, { useState, useEffect } from "react";
import { Card } from "../ui/layout/card";
import { Button } from "../ui/interactive/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/form/select";
import { Loader2, FileSpreadsheet, FileText } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { transactionApi, type Transaction } from "../../services/api";

export function ReportsPage() {
  const [period, setPeriod] = useState('month');
  const [year, setYear] = useState('2024');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await transactionApi.getAll();
      setTransactions(data);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  // Dữ liệu cho biểu đồ Line - Xu hướng chi tiêu theo thời gian
  const trendData = [
    { name: 'Tuần 1', amount: 2500000 },
    { name: 'Tuần 2', amount: 3200000 },
    { name: 'Tuần 3', amount: 2800000 },
    { name: 'Tuần 4', amount: 3500000 },
  ];

  // Dữ liệu so sánh Thu/Chi theo tháng
  const monthlyComparison = [
    { month: 'T1', income: 15000000, expense: 12000000 },
    { month: 'T2', income: 16000000, expense: 13000000 },
    { month: 'T3', income: 18000000, expense: 14000000 },
    { month: 'T4', income: 17000000, expense: 15000000 },
    { month: 'T5', income: 19000000, expense: 14500000 },
    { month: 'T6', income: 20000000, expense: 16000000 },
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const COLOR_CLASSES = ['category-color-0', 'category-color-1', 'category-color-2', 'category-color-3', 'category-color-4', 'category-color-5'];

  const handleExportPDF = () => {
    toast.success('Đang xuất báo cáo PDF...', {
      description: 'Tính năng này sẽ tải xuống báo cáo dạng PDF'
    });
  };

  const handleExportExcel = () => {
    toast.success('Đang xuất báo cáo Excel...', {
      description: 'Tính năng này sẽ tải xuống báo cáo dạng Excel'
    });
  };

  const totalIncome = transactions
    .filter(t => t.category?.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.category?.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

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
      <div className="flex justify-between items-center">
        <h2>Báo cáo & Thống kê</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2" size={16} />
            Xuất PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2" size={16} />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Bộ lọc */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm text-gray-600 mb-2 block">Chu kỳ</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Tháng</SelectItem>
                <SelectItem value="quarter">Quý</SelectItem>
                <SelectItem value="year">Năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600 mb-2 block">Năm</label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-gray-500">Tổng thu nhập</p>
          <p className="text-3xl text-green-600 mt-2">
            {totalIncome.toLocaleString('vi-VN')} ₫
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500">Tổng chi tiêu</p>
          <p className="text-3xl text-red-600 mt-2">
            {totalExpense.toLocaleString('vi-VN')} ₫
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500">Tiết kiệm</p>
          <p className="text-3xl text-blue-600 mt-2">
            {(totalIncome - totalExpense).toLocaleString('vi-VN')} ₫
          </p>
        </Card>
      </div>

      {/* Biểu đồ Pie - Phân loại chi tiêu */}
      <Card className="p-6">
        <h3 className="mb-4">Phân loại chi tiêu theo hạng mục</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry.name}: ${entry.value.toLocaleString('vi-VN')} ₫`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')} ₫`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            Chưa có dữ liệu chi tiêu
          </div>
        )}
      </Card>

      {/* Biểu đồ Bar - So sánh Thu/Chi */}
      <Card className="p-6">
        <h3 className="mb-4">So sánh Thu nhập & Chi tiêu theo tháng</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyComparison}>
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

      {/* Biểu đồ Line - Xu hướng chi tiêu */}
      <Card className="p-6">
        <h3 className="mb-4">Xu hướng chi tiêu</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')} ₫`} />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} name="Chi tiêu" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bảng chi tiết */}
      <Card className="p-6">
        <h3 className="mb-4">Chi tiết theo hạng mục</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Hạng mục</th>
                <th className="text-right py-3 px-4">Số tiền</th>
                <th className="text-right py-3 px-4">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${COLOR_CLASSES[index % COLOR_CLASSES.length]}`}
                    ></div>
                    {item.name}
                  </td>
                  <td className="text-right py-3 px-4">
                    {item.value.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="text-right py-3 px-4">
                    {((item.value / totalExpense) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

