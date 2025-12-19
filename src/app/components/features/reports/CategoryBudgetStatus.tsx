import React from 'react';
import { Card } from '../../ui/layout/card';

interface BudgetStatus {
  category: string;
  limitAmount: number;
  spentAmount: number;
  percentage: number;
}

interface CategoryBudgetStatusProps {
  budgetStatus: BudgetStatus[];
  categoryName?: string;
}

export function CategoryBudgetStatus({ budgetStatus, categoryName }: CategoryBudgetStatusProps) {
  const budgets = categoryName 
    ? budgetStatus.filter(b => b.category === categoryName)
    : budgetStatus;

  if (budgets.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4">Trạng thái ngân sách</h3>
        <div className="text-center text-gray-400 py-8">
          {categoryName ? `Chưa có ngân sách cho danh mục "${categoryName}"` : 'Chưa có dữ liệu ngân sách'}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4">Trạng thái ngân sách</h3>
      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const isOverBudget = budget.percentage > 100;
          const remaining = budget.limitAmount - budget.spentAmount;
          
          return (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg">{budget.category}</h4>
                <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {budget.percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Đã chi: {budget.spentAmount.toLocaleString('vi-VN')} ₫</span>
                  <span>Hạn mức: {budget.limitAmount.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isOverBudget ? 'bg-red-500' : budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {remaining >= 0 
                    ? `Còn lại: ${remaining.toLocaleString('vi-VN')} ₫`
                    : `Vượt quá: ${Math.abs(remaining).toLocaleString('vi-VN')} ₫`
                  }
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

