import React from 'react';
import { Card } from '../ui/layout/card';
import { ProgressBar } from './ProgressBar';
import { Budget } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

interface BudgetListProps {
  budgets: Budget[];
}

export function BudgetList({ budgets }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4">Tình trạng ngân sách</h3>
        <p className="text-gray-400 text-center py-4">Chưa có ngân sách nào được thiết lập</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4">Tình trạng ngân sách</h3>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = Number(budget.spentAmount);
          const limit = Number(budget.limitAmount);
          const percentage = Math.min((spent / limit) * 100, 100);
          const isWarning = percentage >= 80;

          return (
            <div key={budget.id}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{budget.category?.name || 'N/A'}</span>
                <span className={isWarning ? 'text-orange-600' : 'text-gray-600'}>
                  {formatCurrency(spent)} / {formatCurrency(limit)} ₫
                </span>
              </div>
              <ProgressBar percentage={percentage} isWarning={isWarning} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

