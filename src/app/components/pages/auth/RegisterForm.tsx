import React from 'react';
import { Button } from '../../ui/interactive/button';
import { Input } from '../../ui/form/input';
import { Label } from '../../ui/form/label';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading: boolean;
  onFormDataChange: (data: Partial<RegisterFormProps['formData']>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({ formData, loading, onFormDataChange, onSubmit }: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">
          <User className="inline mr-2" size={16} />
          Họ và tên
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
          required
          placeholder="Nhập họ và tên"
        />
      </div>

      <div>
        <Label htmlFor="email">
          <Mail className="inline mr-2" size={16} />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ email: e.target.value })}
          required
          placeholder="Nhập email"
        />
      </div>

      <div>
        <Label htmlFor="password">
          <Lock className="inline mr-2" size={16} />
          Mật khẩu
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onFormDataChange({ password: e.target.value })}
          required
          placeholder="Nhập mật khẩu"
          minLength={6}
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => onFormDataChange({ confirmPassword: e.target.value })}
          required
          placeholder="Nhập lại mật khẩu"
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={16} />
            Đang xử lý...
          </>
        ) : (
          'Đăng ký'
        )}
      </Button>
    </form>
  );
}

