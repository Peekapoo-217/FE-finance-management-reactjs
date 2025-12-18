import React from 'react';
import { Card } from '../ui/layout/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpensePieChartProps {
  data: Array<{ name: string; value: number }>;
  totalExpense: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function ExpensePieChart({ data, totalExpense }: ExpensePieChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Chi tiêu theo hạng mục</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value.toLocaleString('vi-VN')} ₫ (${((entry.value / totalExpense) * 100).toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
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
  );
}

