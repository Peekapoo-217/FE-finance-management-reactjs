import React, { useState, useEffect } from "react";
import { Card } from "../../ui/layout/card";
import { Button } from "../../ui/interactive/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogTrigger } from "../../ui/overlay/dialog";
import { toast } from "sonner";
import { transactionApi, type Transaction, type Budget } from "../../../services/api";
import { useTransactions } from "../../../hooks/useTransactions";
import { TransactionForm } from "./TransactionForm";
import { TransactionItem } from "./TransactionItem";
import { parseCurrencyInput, formatCurrencyInput } from "../../../utils/formatCurrency";

interface TransactionListProps {
  onDataChange?: () => void;
}

export function TransactionList({ onDataChange }: TransactionListProps) {
  const { loading, transactions, wallets, categories, budgets, refetch } = useTransactions();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
    walletId: '',
    categoryId: '',
    description: ''
  });

  useEffect(() => {
    if (wallets.length > 0 && !formData.walletId) {
      setFormData((prev) => ({ ...prev, walletId: wallets[0].id }));
    }
  }, [wallets, formData.walletId]);

  const resetForm = () => {
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      walletId: wallets[0]?.id || '',
      categoryId: '',
      description: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    // Validate: Nếu là expense, phải có budget
    if (formData.type === 'expense' && !hasBudgetForSelectedCategory) {
      toast.error('Danh mục này chưa có ngân sách. Vui lòng tạo ngân sách trước khi thêm giao dịch.');
      return;
    }

    setSubmitting(true);
    try {
      const selectedCategory = categories.find(c => c.id.toString() === formData.categoryId);

      const payload: any = {
        walletId: formData.walletId || undefined,
        categoryName: selectedCategory?.name,
        categoryType: selectedCategory?.type,
        amount: parseCurrencyInput(formData.amount),
        transactionDate: formData.date,
        description: formData.description || undefined
      };

      if (editingId) {
        await transactionApi.update(editingId, payload);
        toast.success('Cập nhật giao dịch thành công');
      } else {
        await transactionApi.create(payload);
        toast.success('Thêm giao dịch thành công');
      }

      setIsOpen(false);
      resetForm();
      await refetch();
      onDataChange?.();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      amount: formatCurrencyInput(transaction.amount.toString()),
      date: transaction.transactionDate.split('T')[0],
      type: transaction.category?.type || 'expense',
      walletId: transaction.walletId,
      categoryId: transaction.categoryId,
      description: transaction.description || ''
    });
    setEditingId(transaction.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa giao dịch này?')) return;
    
    setSubmitting(true);
    try {
      await transactionApi.delete(id);
      toast.success('Xóa giao dịch thành công');
      await refetch();
      onDataChange?.();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );

  // Lấy danh sách category names đã có budget (chỉ cho expense)
  const categoriesWithBudget = new Set(
    budgets
      .filter(b => b.category)
      .map(b => b.category!.name)
  );

  // Filter categories: Nếu là expense, chỉ hiển thị những category đã có budget
  let filteredCategories = categories.filter(c => c.type === formData.type);
  if (formData.type === 'expense') {
    filteredCategories = filteredCategories.filter(c => categoriesWithBudget.has(c.name));
  }
  const hasCategories = filteredCategories.length > 0;
  
  // Check xem category đã chọn có budget chưa (cho expense)
  const selectedCategory = categories.find(c => c.id.toString() === formData.categoryId);
  const hasBudgetForSelectedCategory = formData.type === 'expense' 
    ? selectedCategory ? categoriesWithBudget.has(selectedCategory.name) : false
    : true; // Income không cần budget

  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin mr-2" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>Giao dịch</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button disabled={loading || submitting}>
              <Plus className="mr-2" size={16} />
              Thêm giao dịch
            </Button>
          </DialogTrigger>
          <TransactionForm
            formData={formData}
            editingId={editingId}
            wallets={wallets}
            filteredCategories={filteredCategories}
            hasCategories={hasCategories}
            hasBudgetForSelectedCategory={hasBudgetForSelectedCategory}
            loading={submitting}
            onFormDataChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleSubmit}
          />
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="space-y-3">
          {sortedTransactions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Chưa có giao dịch nào</p>
          ) : (
            sortedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                loading={submitting}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

