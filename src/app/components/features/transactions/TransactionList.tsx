import React, { useState, useEffect } from "react";
import { Card } from "../../ui/layout/card";
import { Button } from "../../ui/interactive/button";
import { Input } from "../../ui/form/input";
import { Label } from "../../ui/form/label";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Calendar,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/overlay/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/form/select";
import { toast } from "sonner";
import { 
  transactionApi, 
  walletApi, 
  budgetCategoryApi,
  type Transaction,
  type Wallet,
  type BudgetCategory
} from "../../../services/api";

interface TransactionListProps {
  onDataChange?: () => void;
}

export function TransactionList({ onDataChange }: TransactionListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
    walletId: '',
    categoryId: '',
    description: ''
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, walletsData, categoriesData] = await Promise.all([
        transactionApi.getAll(),
        walletApi.getAll(),
        budgetCategoryApi.getAll()
      ]);
      setTransactions(transactionsData);
      setWallets(walletsData);
      setCategories(categoriesData);

      // nếu chưa chọn ví, auto chọn ví đầu tiên (nếu có)
      if (!formData.walletId && walletsData.length > 0) {
        setFormData((prev) => ({ ...prev, walletId: walletsData[0].id }));
      }
    } catch (error: any) {
      toast.error('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

    setLoading(true);
    try {
      const selectedCategory = categories.find(c => c.id.toString() === formData.categoryId);

      const payload: any = {
        walletId: formData.walletId || undefined,
        // gửi categoryName + categoryType để transaction-service tự map/sinh UUID
        categoryName: selectedCategory?.name,
        categoryType: selectedCategory?.type,
        amount: parseFloat(formData.amount),
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
      await loadData();
      onDataChange?.();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      amount: transaction.amount.toString(),
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
    
    setLoading(true);
    try {
      await transactionApi.delete(id);
      toast.success('Xóa giao dịch thành công');
      await loadData();
      onDataChange?.();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );

  // Filter categories based on selected type
  const filteredCategories = categories.filter(c => c.type === formData.type);

  const hasCategories = filteredCategories.length > 0;

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
            <Button disabled={loading}>
              <Plus className="mr-2" size={16} />
              Thêm giao dịch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Loại giao dịch</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'income' | 'expense') => 
                    setFormData({ ...formData, type: value, categoryId: '' })
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
                  onValueChange={(value) => setFormData({ ...formData, walletId: value })}
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
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder={hasCategories ? "Chọn danh mục" : "Chưa có danh mục"} />
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
                        Chưa có danh mục. Hãy seed transaction-service hoặc thêm danh mục trước.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Số tiền (₫)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="1000"
                  placeholder="Nhập số tiền"
                />
              </div>

              <div>
                <Label htmlFor="date">Ngày</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Ghi chú (tùy chọn)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Thêm ghi chú"
                />
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

      <Card className="p-4">
        <div className="space-y-3">
          {sortedTransactions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Chưa có giao dịch nào</p>
          ) : (
            sortedTransactions.map((transaction) => {
              const isIncome = transaction.category?.type === 'income';
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      isIncome ? 'bg-green-100' : 'bg-red-100'
                    }`}>
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
                    <span className={`font-medium text-lg ${
                      isIncome ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isIncome ? '+' : '-'}
                      {transaction.amount.toLocaleString('vi-VN')} ₫
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                        disabled={loading}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        disabled={loading}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

