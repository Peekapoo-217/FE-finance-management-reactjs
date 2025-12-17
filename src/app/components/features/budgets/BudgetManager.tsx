import React, { useState, useEffect } from "react";
import { Card } from "../../ui/layout/card";
import { Button } from "../../ui/interactive/button";
import { Input } from "../../ui/form/input";
import { Label } from "../../ui/form/label";
import { Plus, Pencil, Trash2, Target, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/overlay/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/form/select";
import { toast } from "sonner";
import { budgetApi, budgetCategoryApi, type Budget, type BudgetCategory } from "../../../services/api";

interface BudgetManagerProps {
  onDataChange?: () => void;
}

export function BudgetManager({ onDataChange }: BudgetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        categoryId: parseInt(formData.categoryId),
        limitAmount: parseFloat(formData.limitAmount),
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
      limitAmount: budget.limitAmount.toString(),
      period: budget.period
    });
    setEditingId(budget.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Chỉnh sửa ngân sách' : 'Thêm ngân sách mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="categoryId">Danh mục chi tiêu</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="limitAmount">Hạn mức (₫)</Label>
                <Input
                  id="limitAmount"
                  type="number"
                  value={formData.limitAmount}
                  onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
                  required
                  min="0"
                  step="100000"
                  placeholder="Nhập hạn mức ngân sách"
                />
              </div>

              <div>
                <Label htmlFor="period">Chu kỳ</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => 
                    setFormData({ ...formData, period: value })
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
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.length === 0 ? (
          <Card className="col-span-full p-8">
            <p className="text-center text-gray-400">Chưa có ngân sách nào được thiết lập</p>
          </Card>
        ) : (
          budgets.map((budget) => {
            const spentPercentage = Math.min((budget.spentAmount / budget.limitAmount) * 100, 100);
            const isOverBudget = spentPercentage >= 100;
            const isWarning = spentPercentage >= 80;

            return (
              <Card key={budget.id} className="p-6">
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
                        {budget.period === 'weekly' ? 'Hàng tuần' : 
                         budget.period === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                      disabled={loading}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
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
                        {budget.spentAmount.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Hạn mức</p>
                      <p className="text-lg font-medium text-blue-600">
                        {budget.limitAmount.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

