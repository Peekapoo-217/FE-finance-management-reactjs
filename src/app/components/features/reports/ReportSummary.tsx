import React from 'react';
import { Card } from '../../ui/layout/card';

interface ReportSummaryProps {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  categoryName?: string;
}

export function ReportSummary({ totalIncome, totalExpense, savings, categoryName }: ReportSummaryProps) {
  const title = categoryName ? `Thống kê: ${categoryName}` : 'Tổng quan';
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
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
            {savings.toLocaleString('vi-VN')} ₫
          </p>
        </Card>
      </div>
    </div>
  );
}

