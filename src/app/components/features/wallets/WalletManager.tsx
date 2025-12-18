import React, { useState } from "react";
import { Card } from "../../ui/layout/card";
import { Button } from "../../ui/interactive/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogTrigger } from "../../ui/overlay/dialog";
import { toast } from "sonner";
import { walletApi, type CreateWalletDto, type Wallet } from "../../../services/api";
import { useWallets } from "../../../hooks/useWallets";
import { WalletForm } from "./WalletForm";
import { WalletCard } from "./WalletCard";
import { EditBalanceDialog } from "./EditBalanceDialog";
import { parseCurrencyInput, formatCurrencyInput } from "../../../utils/formatCurrency";

interface WalletManagerProps {
  onDataChange?: () => void;
}

export function WalletManager({ onDataChange }: WalletManagerProps) {
  const { loading, wallets, refetch } = useWallets();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    currency: 'VND',
    type: 'cash'
  });

  const [balanceFormData, setBalanceFormData] = useState({
    balance: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      balance: '',
      currency: 'VND',
      type: 'cash'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Vui lòng nhập tên ví');
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateWalletDto = {
        name: formData.name,
        balance: formData.balance ? parseCurrencyInput(formData.balance) : 0,
        currency: formData.currency,
        type: formData.type,
      };

      await walletApi.create(payload);
      toast.success('Tạo ví thành công');
      
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

  const handleEditBalance = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setBalanceFormData({ balance: formatCurrencyInput(wallet.balance.toString()) });
    setIsEditBalanceOpen(true);
  };

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingWallet) return;

    const newBalance = parseCurrencyInput(balanceFormData.balance);
    if (isNaN(newBalance) || newBalance < 0) {
      toast.error('Số dư không hợp lệ');
      return;
    }

    setSubmitting(true);
    try {
      await walletApi.update(editingWallet.id, { balance: newBalance });
      toast.success('Cập nhật số dư thành công');
      
      setIsEditBalanceOpen(false);
      setEditingWallet(null);
      setBalanceFormData({ balance: '' });
      await refetch();
      onDataChange?.();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && wallets.length === 0) {
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
        <h2>Quản lý ví</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button disabled={loading || submitting}>
              <Plus className="mr-2" size={16} />
              Thêm ví
            </Button>
          </DialogTrigger>
          <WalletForm
            formData={formData}
            loading={submitting}
            onFormDataChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleSubmit}
          />
        </Dialog>
      </div>

      <Dialog open={isEditBalanceOpen} onOpenChange={(open) => {
        setIsEditBalanceOpen(open);
        if (!open) {
          setEditingWallet(null);
          setBalanceFormData({ balance: '' });
        }
      }}>
        <EditBalanceDialog
          wallet={editingWallet}
          balance={balanceFormData.balance}
          loading={submitting}
          onBalanceChange={(balance) => setBalanceFormData({ balance })}
          onSubmit={handleUpdateBalance}
        />
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.length === 0 ? (
          <Card className="col-span-full p-8">
            <p className="text-center text-gray-400">Chưa có ví nào. Hãy tạo ví đầu tiên!</p>
          </Card>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onEditBalance={handleEditBalance}
            />
          ))
        )}
      </div>
    </div>
  );
}

