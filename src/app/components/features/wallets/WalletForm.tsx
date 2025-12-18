import React from 'react';
import { Button } from '../../ui/interactive/button';
import { Input } from '../../ui/form/input';
import { Label } from '../../ui/form/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/form/select';
import { DialogContent, DialogHeader, DialogTitle } from '../../ui/overlay/dialog';
import { Loader2 } from 'lucide-react';
import { formatCurrencyInput } from '../../../utils/formatCurrency';

interface WalletFormProps {
  formData: {
    name: string;
    balance: string;
    currency: string;
    type: string;
  };
  loading: boolean;
  onFormDataChange: (data: Partial<WalletFormProps['formData']>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WalletForm({ formData, loading, onFormDataChange, onSubmit }: WalletFormProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Thêm ví mới</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Tên ví</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormDataChange({ name: e.target.value })}
            required
            placeholder="Ví dụ: Ví tiền mặt, Tài khoản ngân hàng"
          />
        </div>

        <div>
          <Label htmlFor="balance">Số dư ban đầu (₫)</Label>
          <Input
            id="balance"
            type="text"
            value={formData.balance}
            onChange={(e) => {
              const formatted = formatCurrencyInput(e.target.value);
              onFormDataChange({ balance: formatted });
            }}
            placeholder="Nhập số dư ban đầu (ví dụ: 4.490.000)"
          />
        </div>

        <div>
          <Label htmlFor="currency">Loại tiền tệ</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => onFormDataChange({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VND">VND (Việt Nam Đồng)</SelectItem>
              <SelectItem value="USD">USD (Đô la Mỹ)</SelectItem>
              <SelectItem value="EUR">EUR (Euro)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Loại ví</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => onFormDataChange({ type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Tiền mặt</SelectItem>
              <SelectItem value="bank">Ngân hàng</SelectItem>
              <SelectItem value="e-wallet">Ví điện tử</SelectItem>
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
            'Thêm'
          )}
        </Button>
      </form>
    </DialogContent>
  );
}

