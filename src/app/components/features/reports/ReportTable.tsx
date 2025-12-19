import React from 'react';
import { Card } from '../../ui/layout/card';

interface ReportTableProps {
  data: Array<{ name: string; value: number }>;
  totalExpense: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const COLOR_CLASSES = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

export function ReportTable({ data, totalExpense }: ReportTableProps) {
  return (
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
            {data.length > 0 ? (
              data.map((item, index) => (
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
                    {totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-400">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

