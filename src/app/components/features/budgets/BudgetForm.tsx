import React from 'react';
import { Button } from '../../ui/interactive/button';
import { Input } from '../../ui/form/input';
import { Label } from '../../ui/form/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/form/select';
import { DialogContent, DialogHeader, DialogTitle } from '../../ui/overlay/dialog';
import { Loader2 } from 'lucide-react';
import { formatCurrencyInput } from '../../../utils/formatCurrency';
import { type BudgetCategory } from '../../../services/api';

interface BudgetFormProps {
  formData: {
    categoryId: string;
    limitAmount: string;
    period: 'weekly' | 'monthly' | 'yearly';
  };
  editingId: string | null;
  categories: BudgetCategory[];
  loading: boolean;
  onFormDataChange: (data: Partial<BudgetFormProps['formData']>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenCreateCategoryDialog: () => void;
}

export function BudgetForm({
  formData,
  editingId,
  categories,
  loading,
  onFormDataChange,
  onSubmit,
  onOpenCreateCategoryDialog,
}: BudgetFormProps) {
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {editingId ? 'Chỉnh sửa ngân sách' : 'Thêm ngân sách mới'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="categoryId">Ngân sách chi tiêu</Label>
            <button
              type="button"
              onClick={onOpenCreateCategoryDialog}
              className="text-sm text-blue-600 hover:underline"
            >
              + Thêm danh mục mới
            </button>
          </div>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => onFormDataChange({ categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn ngân sách" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  Chưa có danh mục. Nhấn "Thêm danh mục mới" để tạo.
                </div>
              ) : (
                expenseCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="limitAmount">Hạn mức (₫)</Label>
          <Input
            id="limitAmount"
            type="text"
            value={formData.limitAmount}
            onChange={(e) => {
              const formatted = formatCurrencyInput(e.target.value);
              onFormDataChange({ limitAmount: formatted });
            }}
            required
            placeholder="Nhập hạn mức ngân sách (ví dụ: 4.490.000)"
          />
        </div>

        <div>
          <Label htmlFor="period">Chu kỳ</Label>
          <Select
            value={formData.period}
            onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => 
              onFormDataChange({ period: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Tuần</SelectItem>
              <SelectItem value="monthly">Tháng</SelectItem>
              <SelectItem value="yearly">Năm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Đang xử lý...
            </>
          ) : (
            editingId ? 'Cập nhật' : 'Thêm'
          )}
        </Button>
      </form>
    </DialogContent>
  );
}

