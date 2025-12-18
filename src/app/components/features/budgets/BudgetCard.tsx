import React from 'react';
import { Card } from '../../ui/layout/card';
import { Button } from '../../ui/interactive/button';
import { Pencil, Trash2, Target } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';
import { type Budget } from '../../../services/api';

interface BudgetCardProps {
  budget: Budget;
  loading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, loading, onEdit, onDelete }: BudgetCardProps) {
  const spentPercentage = Math.min((budget.spentAmount / budget.limitAmount) * 100, 100);
  const isOverBudget = spentPercentage >= 100;
  const isWarning = spentPercentage >= 80;

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'weekly':
        return 'Hàng tuần';
      case 'monthly':
        return 'Hàng tháng';
      case 'yearly':
        return 'Hàng năm';
      default:
        return '';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            isOverBudget ? 'bg-red-100' : isWarning ? 'bg-orange-100' : 'bg-blue-100'
          }`}>
            <Target className={`${
              isOverBudget ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-blue-600'
            }`} size={20} />
          </div>
          <div>
            <h3 className="font-medium">{budget.category?.name || 'N/A'}</h3>
            <p className="text-sm text-gray-500">
              {getPeriodLabel(budget.period)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(budget)}
            disabled={loading}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(budget.id)}
            disabled={loading}
          >
            <Trash2 size={14} className="text-red-600" />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Đã chi</span>
            <span className={`font-medium ${
              isOverBudget ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-gray-700'
            }`}>
              {spentPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isOverBudget ? 'bg-red-600' : isWarning ? 'bg-orange-500' : 'bg-blue-600'
              }`}
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500">Đã chi</p>
            <p className="text-lg font-medium">
              {formatCurrency(budget.spentAmount)} ₫
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Hạn mức</p>
            <p className="text-lg font-medium text-blue-600">
              {formatCurrency(budget.limitAmount)} ₫
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

