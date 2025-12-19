import React from 'react';
import { Card } from '../../ui/layout/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportLineChartProps {
  data: Array<{ name: string; amount: number }>;
}

export function ReportLineChart({ data }: ReportLineChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Xu hướng chi tiêu</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')} ₫`} />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} name="Chi tiêu" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Chưa có dữ liệu
        </div>
      )}
    </Card>
  );
}

