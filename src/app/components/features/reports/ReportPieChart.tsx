import React from 'react';
import { Card } from '../../ui/layout/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportPieChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function ReportPieChart({ data }: ReportPieChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Phân loại chi tiêu theo hạng mục</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={(entry) => `${entry.name}: ${entry.value.toLocaleString('vi-VN')} ₫`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
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
  );
}

