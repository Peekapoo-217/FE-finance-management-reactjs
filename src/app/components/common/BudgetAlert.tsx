import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Budget } from '../../services/api';

interface BudgetAlertProps {
  budgets: Budget[];
}

export function BudgetAlert({ budgets }: BudgetAlertProps) {
  const alerts = budgets.filter(budget => {
    const percentage = (Number(budget.spentAmount) / Number(budget.limitAmount)) * 100;
    return percentage >= 80;
  });

  if (alerts.length === 0) return null;

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
      <div className="flex items-center">
        <AlertCircle className="text-orange-400 mr-3" size={24} />
        <div>
          <p className="font-medium text-orange-800">Cảnh báo danh mục!</p>
          <p className="text-orange-700">
            Bạn đã chi tiêu vượt 80% danh mục cho: {alerts.map(b => b.category?.name).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}

