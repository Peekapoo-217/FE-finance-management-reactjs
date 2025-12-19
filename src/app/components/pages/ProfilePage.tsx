import { useState, useEffect } from "react";
import { Card } from "../ui/layout/card";
import { Button } from "../ui/interactive/button";
import { Input } from "../ui/form/input";
import { Label } from "../ui/form/label";
import { User, Mail, Lock, Save, Loader2, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "../../services/api"; 

export function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user, setUser] = useState({ name: "", email: "" });
  const [formData, setFormData] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await authApi.getProfile();
        setUser({ name: profile.name || "", email: profile.email });
        setFormData({ ...formData, name: profile.name || "" });
      } catch (error: any) {
        toast.error("Không tải được hồ sơ: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateProfile({ name: formData.name });
      setUser({ ...user, name: updated.name || "" });
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới ít nhất 6 ký tự");
      return;
    }
    try {
      setChangingPassword(true);
      await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Hồ sơ cá nhân</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Thông tin cá nhân</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <Label htmlFor="name"><User className="inline mr-2" size={16} /> Họ và tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email"><Mail className="inline mr-2" size={16} /> Email</Label>
            <Input id="email" type="email" value={user.email} disabled />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Save className="mr-2" size={16} />}
            Lưu thay đổi
          </Button>
        </form>
      </Card>

     {/* Đổi mật khẩu - ĐÃ THÊM TOGGLE VISIBILITY */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Đổi mật khẩu</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Mật khẩu hiện tại */}
          <div>
            <Label htmlFor="current">
              <Lock className="inline mr-2" size={16} />
              Mật khẩu hiện tại
            </Label>
            <div className="relative">
              <Input
                id="current"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                placeholder="Nhập mật khẩu hiện tại"
                className="pr-10" // Để chừa chỗ cho icon mắt
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div>
            <Label htmlFor="new">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="new"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                placeholder="Nhập mật khẩu mới"
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Nhập lại mật khẩu mới"
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={changingPassword}>
            {changingPassword ? (
              <Loader2 className="mr-2 animate-spin" size={16} />
            ) : (
              <Lock className="mr-2" size={16} />
            )}
            Đổi mật khẩu
          </Button>
        </form>
      </Card>
    </div>
  );
}