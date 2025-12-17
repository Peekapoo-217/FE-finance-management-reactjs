import { useState } from "react";
import { Card } from "../ui/layout/card";
import { Button } from "../ui/interactive/button";
import { Input } from "../ui/form/input";
import { Label } from "../ui/form/label";
import { User, Mail, Lock, Target, Save } from "lucide-react";
import { toast } from "sonner";

interface ProfilePageProps {
  user: {
    name: string;
    email: string;
    savingsGoal: number;
  };
  onUpdate: (user: any) => void;
}

export function ProfilePage({ user, onUpdate }: ProfilePageProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    savingsGoal: user.savingsGoal.toString()
  });

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: formData.name,
      email: formData.email,
      savingsGoal: parseFloat(formData.savingsGoal)
    });
    toast.success('Cập nhật hồ sơ thành công!');
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    toast.success('Đổi mật khẩu thành công!');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2>Hồ sơ cá nhân</h2>

      {/* Thông tin cá nhân */}
      <Card className="p-6">
        <h3 className="mb-6">Thông tin cá nhân</h3>
        <form onSubmit={handleSubmitProfile} className="space-y-4">
          <div>
            <Label htmlFor="name">
              <User className="inline mr-2" size={16} />
              Họ và tên
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Nhập email"
            />
          </div>

          <div>
            <Label htmlFor="savingsGoal">
              <Target className="inline mr-2" size={16} />
              Mục tiêu tiết kiệm hàng tháng (₫)
            </Label>
            <Input
              id="savingsGoal"
              type="number"
              value={formData.savingsGoal}
              onChange={(e) => setFormData({ ...formData, savingsGoal: e.target.value })}
              required
              min="0"
              step="100000"
              placeholder="Nhập mục tiêu tiết kiệm"
            />
          </div>

          <Button type="submit" className="w-full">
            <Save className="mr-2" size={16} />
            Lưu thay đổi
          </Button>
        </form>
      </Card>

      {/* Đổi mật khẩu */}
      <Card className="p-6">
        <h3 className="mb-6">Đổi mật khẩu</h3>
        <form onSubmit={handleSubmitPassword} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">
              <Lock className="inline mr-2" size={16} />
              Mật khẩu hiện tại
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div>
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              placeholder="Nhập mật khẩu mới"
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Nhập lại mật khẩu mới"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full">
            <Lock className="mr-2" size={16} />
            Đổi mật khẩu
          </Button>
        </form>
      </Card>

      {/* Thống kê tài khoản */}
      <Card className="p-6">
        <h3 className="mb-6">Thống kê tài khoản</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600">Số giao dịch</p>
            <p className="text-3xl text-blue-600 mt-2">0</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600">Ngày tham gia</p>
            <p className="text-xl text-green-600 mt-2">14/12/2024</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600">Ngân sách đang theo dõi</p>
            <p className="text-3xl text-purple-600 mt-2">0</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

