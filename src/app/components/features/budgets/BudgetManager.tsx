import React, { useState, useEffect } from "react";
import { Card } from "../../ui/layout/card";
import { Button } from "../../ui/interactive/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogTrigger } from "../../ui/overlay/dialog";
import { toast } from "sonner";
import { budgetApi, budgetCategoryApi, type Budget, type BudgetCategory } from "../../../services/api";
import { parseCurrencyInput, formatCurrencyInput } from "../../../utils/formatCurrency";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { BudgetForm } from "./BudgetForm";
import { BudgetCard } from "./BudgetCard";

interface BudgetManagerProps {
  onDataChange?: () => void;
}

export function BudgetManager({ onDataChange }: BudgetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  
  const [formData, setFormData] = useState({
    categoryId: '',
    limitAmount: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly'
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [budgetsData, categoriesData] = await Promise.all([
        budgetApi.getAll(),
        budgetCategoryApi.getAll()
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      limitAmount: '',
      period: 'monthly'
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast.error('Vui lòng chọn ngân sách');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        categoryId: parseInt(formData.categoryId),
        limitAmount: parseCurrencyInput(formData.limitAmount),
        period: formData.period
      };

      if (editingId) {
        await budgetApi.update(editingId, payload);
        toast.success('Cập nhật ngân sách thành công');
      } else {
        await budgetApi.create(payload);
        toast.success('Thêm ngân sách thành công');
      }

      setIsOpen(false);
      resetForm();
      await loadData();
      onDataChange?.();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      categoryId: budget.categoryId.toString(),
      limitAmount: formatCurrencyInput(budget.limitAmount.toString()),
      period: budget.period
    });
    setEditingId(budget.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa ngân sách này?')) return;
    
    setLoading(true);
    try {
      await budgetApi.delete(id);
      toast.success('Xóa ngân sách thành công');
      await loadData();
      onDataChange?.();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryCreated = async (newCategory: BudgetCategory) => {
    // Reload categories và tự động chọn category mới
    await loadData();
    setFormData({ ...formData, categoryId: newCategory.id.toString() });
  };

  // Only expense categories for budgets
  const expenseCategories = categories.filter(c => c.type === 'expense');

  if (loading && budgets.length === 0) {
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
        <h2>Quản lý ngân sách</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button disabled={loading}>
              <Plus className="mr-2" size={16} />
              Thêm ngân sách
            </Button>
          </DialogTrigger>
          <BudgetForm
            formData={formData}
            editingId={editingId}
            categories={categories}
            loading={loading}
            onFormDataChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleSubmit}
            onOpenCreateCategoryDialog={() => setIsCategoryDialogOpen(true)}
          />
        </Dialog>
      </div>

      {/* Dialog thêm category mới */}
      <CreateCategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onCategoryCreated={handleCategoryCreated}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.length === 0 ? (
          <Card className="col-span-full p-8">
            <p className="text-center text-gray-400">Chưa có ngân sách nào được thiết lập</p>
          </Card>
        ) : (
          budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

