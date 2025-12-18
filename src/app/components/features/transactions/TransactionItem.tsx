import React from 'react';
import { Button } from '../../ui/interactive/button';
import { ArrowUpCircle, ArrowDownCircle, Calendar, Pencil, Trash2 } from 'lucide-react';
import { Transaction } from '../../../services/api';
import { formatCurrency } from '../../../utils/formatCurrency';

interface TransactionItemProps {
  transaction: Transaction;
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, loading, onEdit, onDelete }: TransactionItemProps) {
  const isIncome = transaction.category?.type === 'income';

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
          {isIncome ? (
            <ArrowUpCircle className="text-green-600" size={24} />
          ) : (
            <ArrowDownCircle className="text-red-600" size={24} />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.category?.name || 'N/A'}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(transaction.transactionDate).toLocaleDateString('vi-VN')}
            </span>
            {transaction.wallet && (
              <span className="text-gray-400">Ví: {transaction.wallet.name}</span>
            )}
            {transaction.description && (
              <span className="text-gray-400">{transaction.description}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-medium text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)} ₫
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
            disabled={loading}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction.id)}
            disabled={loading}
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}

