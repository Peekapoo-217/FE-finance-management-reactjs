import React from 'react';
import { Button } from '../../ui/interactive/button';
import { Input } from '../../ui/form/input';
import { Label } from '../../ui/form/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/form/select';
import { DialogContent, DialogHeader, DialogTitle } from '../../ui/overlay/dialog';
import { Loader2 } from 'lucide-react';
import { Wallet, BudgetCategory } from '../../../services/api';
import { formatCurrencyInput, parseCurrencyInput } from '../../../utils/formatCurrency';

interface TransactionFormProps {
  formData: {
    amount: string;
    date: string;
    type: 'income' | 'expense';
    walletId: string;
    categoryId: string;
    description: string;
  };
  editingId: string | null;
  wallets: Wallet[];
  filteredCategories: BudgetCategory[];
  hasCategories: boolean;
  hasBudgetForSelectedCategory: boolean;
  loading: boolean;
  onFormDataChange: (data: Partial<TransactionFormProps['formData']>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TransactionForm({
  formData,
  editingId,
  wallets,
  filteredCategories,
  hasCategories,
  hasBudgetForSelectedCategory,
  loading,
  onFormDataChange,
  onSubmit,
}: TransactionFormProps) {
  // Tính toán validation số tiền với số dư ví
  const selectedWallet = wallets.find(w => w.id === formData.walletId);
  const amount = parseCurrencyInput(formData.amount);
  const walletBalance = selectedWallet ? Number(selectedWallet.balance) : 0;
  const isExpense = formData.type === 'expense';
  const exceedsBalance = isExpense && amount > walletBalance && formData.amount !== '';
  const balanceError = exceedsBalance 
    ? `Số tiền vượt quá số dư ví. Số dư hiện tại: ${walletBalance.toLocaleString('vi-VN')} ₫`
    : '';

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {editingId ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Loại giao dịch</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'income' | 'expense') =>
              onFormDataChange({ type: value, categoryId: '' })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">📈 Thu nhập</SelectItem>
              <SelectItem value="expense">📉 Chi tiêu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="walletId">Ví</Label>
          <Select
            value={formData.walletId}
            onValueChange={(value) => onFormDataChange({ walletId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn ví" />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  {wallet.name} ({wallet.balance.toLocaleString('vi-VN')} ₫)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="categoryId">
            Danh mục {formData.type === 'income' ? 'thu nhập' : 'chi tiêu'}
          </Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => onFormDataChange({ categoryId: value })}
          >
            <SelectTrigger className={formData.type === 'expense' && formData.categoryId && !hasBudgetForSelectedCategory ? 'border-red-500' : ''}>
              <SelectValue placeholder={hasCategories ? "Chọn danh mục" : formData.type === 'expense' ? "Chưa có danh mục có ngân sách" : "Chưa có danh mục"} />
            </SelectTrigger>
            <SelectContent>
              {hasCategories ? (
                filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {formData.type === 'expense' 
                    ? 'Chưa có danh mục chi tiêu nào có ngân sách. Vui lòng tạo ngân sách trước.'
                    : 'Chưa có danh mục. Hãy seed transaction-service hoặc thêm danh mục trước.'}
                </div>
              )}
            </SelectContent>
          </Select>
          {formData.type === 'expense' && formData.categoryId && !hasBudgetForSelectedCategory && (
            <p className="text-sm text-red-600 mt-1">
              ⚠️ Danh mục này chưa có ngân sách. Vui lòng tạo ngân sách trước khi thêm giao dịch.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Số tiền (₫)</Label>
          <Input
            id="amount"
            type="text"
            value={formData.amount}
            onChange={(e) => {
              const formatted = formatCurrencyInput(e.target.value);
              onFormDataChange({ amount: formatted });
            }}
            required
            placeholder="Nhập số tiền (ví dụ: 4.490.000)"
            className={exceedsBalance ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          />
          {exceedsBalance && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              {balanceError}
            </p>
          )}
          {!exceedsBalance && formData.walletId && isExpense && formData.amount && (
            <p className="text-sm text-gray-500 mt-1">
              Số dư ví: {walletBalance.toLocaleString('vi-VN')} ₫
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="date">Ngày</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => onFormDataChange({ date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Ghi chú (tùy chọn)</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => onFormDataChange({ description: e.target.value })}
            placeholder="Thêm ghi chú"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || exceedsBalance || (formData.type === 'expense' && !hasBudgetForSelectedCategory)}
        >
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

