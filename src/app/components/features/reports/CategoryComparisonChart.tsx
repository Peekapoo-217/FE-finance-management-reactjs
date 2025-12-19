import React from 'react';
import { Card } from '../../ui/layout/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryComparisonChartProps {
  data: Array<{ name: string; value: number }>;
}

export function CategoryComparisonChart({ data }: CategoryComparisonChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">So sánh chi tiêu theo danh mục</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')} ₫`} />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="Chi tiêu" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-400">
          Chưa có dữ liệu chi tiêu
        </div>
      )}
    </Card>
  );
}

