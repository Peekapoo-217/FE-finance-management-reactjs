import React from 'react';
import { Card } from '../../ui/layout/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportBarChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
}

export function ReportBarChart({ data }: ReportBarChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">So sánh Thu nhập & Chi tiêu theo tháng</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')} ₫`} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Thu nhập" />
            <Bar dataKey="expense" fill="#ef4444" name="Chi tiêu" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-400">
          Chưa có dữ liệu
        </div>
      )}
    </Card>
  );
}

