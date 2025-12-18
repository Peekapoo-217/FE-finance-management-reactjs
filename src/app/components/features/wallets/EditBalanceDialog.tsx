import React from 'react';
import { Button } from '../../ui/interactive/button';
import { Input } from '../../ui/form/input';
import { Label } from '../../ui/form/label';
import { DialogContent, DialogHeader, DialogTitle } from '../../ui/overlay/dialog';
import { Loader2 } from 'lucide-react';
import { Wallet } from '../../../services/api';
import { formatCurrencyInput } from '../../../utils/formatCurrency';

interface EditBalanceDialogProps {
  wallet: Wallet | null;
  balance: string;
  loading: boolean;
  onBalanceChange: (balance: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditBalanceDialog({
  wallet,
  balance,
  loading,
  onBalanceChange,
  onSubmit,
}: EditBalanceDialogProps) {
  if (!wallet) return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sửa số dư - {wallet.name}</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="edit-balance">Số dư mới ({wallet.currency})</Label>
          <Input
            id="edit-balance"
            type="text"
            value={balance}
            onChange={(e) => {
              const formatted = formatCurrencyInput(e.target.value);
              onBalanceChange(formatted);
            }}
            required
            placeholder="Nhập số dư mới (ví dụ: 4.490.000)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Số dư hiện tại: {Number(wallet.balance).toLocaleString('vi-VN')} {wallet.currency}
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Đang cập nhật...
            </>
          ) : (
            'Cập nhật'
          )}
        </Button>
      </form>
    </DialogContent>
  );
}

