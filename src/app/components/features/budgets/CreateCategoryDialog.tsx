import React, { useState } from 'react';
import { Button } from '../../ui/interactive/button';
import { Input } from '../../ui/form/input';
import { Label } from '../../ui/form/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/form/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/overlay/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { budgetCategoryApi, type BudgetCategory } from '../../../services/api';

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated?: (category: BudgetCategory) => void;
}

export function CreateCategoryDialog({ 
  open, 
  onOpenChange,
  onCategoryCreated 
}: CreateCategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    setLoading(true);
    try {
      const newCategory = await budgetCategoryApi.create({
        name: formData.name.trim(),
        type: formData.type,
      });
      
      toast.success('Thêm danh mục thành công!');
      setFormData({ name: '', type: 'expense', description: '' });
      onOpenChange(false);
      onCategoryCreated?.(newCategory);
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setFormData({ name: '', type: 'expense', description: '' });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Tên danh mục</Label>
            <Input
              id="categoryName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ví dụ: Ăn uống, Mua sắm..."
            />
          </div>

          <div>
            <Label htmlFor="categoryType">Loại</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'income' | 'expense') => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Chi tiêu</SelectItem>
                <SelectItem value="income">Thu nhập</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Lưu ý: Chỉ danh mục "Chi tiêu" mới có thể tạo budget
            </p>
          </div>

          <div>
            <Label htmlFor="categoryDescription">Mô tả (tùy chọn)</Label>
            <Input
              id="categoryDescription"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả về danh mục này"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={16} />
                Đang tạo...
              </>
            ) : (
              'Thêm danh mục'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

