import React from 'react';
import { Card } from '../../ui/layout/card';
import { Button } from '../../ui/interactive/button';
import { Pencil, Wallet as WalletIcon } from 'lucide-react';
import { Wallet } from '../../../services/api';

interface WalletCardProps {
  wallet: Wallet;
  onEditBalance: (wallet: Wallet) => void;
}

export function WalletCard({ wallet, onEditBalance }: WalletCardProps) {
  return (
    <Card key={wallet.id} className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <WalletIcon className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-medium">{wallet.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {wallet.type === 'cash' ? 'Tiền mặt' : 
               wallet.type === 'bank' ? 'Ngân hàng' : 'Ví điện tử'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditBalance(wallet)}
          className="h-8 w-8 p-0"
        >
          <Pencil size={16} />
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-medium text-blue-600">
          {Number(wallet.balance).toLocaleString('vi-VN')} {wallet.currency}
        </p>
        <p className="text-xs text-gray-500">
          Tạo lúc: {new Date(wallet.createdAt).toLocaleDateString('vi-VN')}
        </p>
      </div>
    </Card>
  );
}

