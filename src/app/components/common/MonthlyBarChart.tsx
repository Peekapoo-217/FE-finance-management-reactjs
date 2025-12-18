import React from 'react';
import { Card } from '../ui/layout/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyBarChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Thu/Chi theo tháng</h3>
      <ResponsiveContainer width="100%" height={300}>
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
    </Card>
  );
}

