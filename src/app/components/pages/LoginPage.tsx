import React, { useState } from "react";
import { Card } from "../ui/layout/card";
import { Button } from "../ui/interactive/button";
import { Input } from "../ui/form/input";
import { Label } from "../ui/form/label";
import { Wallet, Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authApi, TokenManager } from "../../services/api";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister && formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Register -> sau đó auto login để lấy token
        await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        const loginRes = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        TokenManager.setToken(loginRes.accessToken);
        TokenManager.setUserId(loginRes.user.id.toString());

        toast.success('Đăng ký & đăng nhập thành công!');
        onLogin();
      } else {
        // Login
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        TokenManager.setToken(response.accessToken);
        TokenManager.setUserId(response.user.id.toString());

        toast.success('Đăng nhập thành công!');
        onLogin();
      }
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Wallet className="text-white" size={32} />
          </div>
          <h1 className="text-3xl mb-2">Quản Lý Chi Tiêu</h1>
          <p className="text-gray-600">
            {isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập vào tài khoản'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <Label htmlFor="name">
                <User className="inline mr-2" size={16} />
                Họ và tên
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={isRegister}
                placeholder="Nhập họ và tên"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">
              <Mail className="inline mr-2" size={16} />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Nhập mật khẩu"
              minLength={6}
            />
          </div>

          {isRegister && (
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required={isRegister}
                placeholder="Nhập lại mật khẩu"
                minLength={6}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={16} />
                Đang xử lý...
              </>
            ) : (
              isRegister ? 'Đăng ký' : 'Đăng nhập'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:underline"
          >
            {isRegister 
              ? 'Đã có tài khoản? Đăng nhập' 
              : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </div>

        {!isRegister && (
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-gray-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

