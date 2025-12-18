import React, { useState } from "react";
import { Card } from "../ui/layout/card";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { authApi, TokenManager, walletApi } from "../../services/api";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";

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
        await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        
        setFormData({
          name: '',
          email: formData.email,
          password: '',
          confirmPassword: ''
        });
        setIsRegister(false);
      } else {
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        if (!response || !response.accessToken) {
          toast.error('Lỗi: Không nhận được token từ server');
          return;
        }

        TokenManager.setToken(response.accessToken);
        if (response.user?.id) {
          TokenManager.setUserId(response.user.id.toString());
        }

        try {
          await walletApi.getAll();
        } catch (error) {
          console.log('Wallet creation will happen on demand');
        }

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

        {isRegister ? (
          <RegisterForm
            formData={formData}
            loading={loading}
            onFormDataChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleSubmit}
          />
        ) : (
          <LoginForm
            formData={formData}
            loading={loading}
            onFormDataChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleSubmit}
          />
        )}

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

