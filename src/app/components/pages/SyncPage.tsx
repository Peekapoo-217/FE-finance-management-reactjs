import { useState } from "react";
import { Card } from "../ui/layout/card";
import { Button } from "../ui/interactive/button";
import { Input } from "../ui/form/input";
import { Label } from "../ui/form/label";
import { RefreshCw, Link, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";

export function SyncPage() {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = () => {
    if (!apiKey.trim()) {
      toast.error('Vui lòng nhập API Key');
      return;
    }
    setIsConnected(true);
    toast.success('Kết nối thành công!');
  };

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Đồng bộ thành công!', {
        description: 'Đã nhập 5 giao dịch mới từ ngân hàng'
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey('');
    toast.info('Đã ngắt kết nối');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2>Đồng bộ giao dịch tự động</h2>

      {/* Hướng dẫn */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1" size={24} />
          <div>
            <h3 className="text-blue-900 mb-2">Hướng dẫn kết nối</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Truy cập trang cài đặt API của ngân hàng/ví điện tử</li>
              <li>• Tạo API Key mới với quyền đọc giao dịch</li>
              <li>• Sao chép API Key và dán vào ô bên dưới</li>
              <li>• Nhấn "Kết nối" để bắt đầu đồng bộ</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Kết nối ngân hàng */}
      <Card className="p-6">
        <h3 className="mb-6">Kết nối Ngân hàng / Ví điện tử</h3>
        
        {!isConnected ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Nhập API Key từ ngân hàng/ví điện tử"
              />
              <p className="text-sm text-gray-500 mt-2">
                Lưu ý: API Key của bạn sẽ được mã hóa và lưu trữ an toàn
              </p>
            </div>
            <Button onClick={handleConnect} className="w-full">
              <Link className="mr-2" size={16} />
              Kết nối
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-green-900">Đã kết nối</p>
                  <p className="text-sm text-green-700">API Key: ••••••••{apiKey.slice(-4)}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleDisconnect}>
                Ngắt kết nối
              </Button>
            </div>

            <Button 
              onClick={handleSync} 
              disabled={isSyncing}
              className="w-full"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="mr-2 animate-spin" size={16} />
                  Đang đồng bộ...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2" size={16} />
                  Đồng bộ ngay
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Các nguồn hỗ trợ */}
      <Card className="p-6">
        <h3 className="mb-6">Nguồn hỗ trợ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'VietcomBank', logo: '🏦', supported: true },
            { name: 'Techcombank', logo: '🏦', supported: true },
            { name: 'MoMo', logo: '📱', supported: true },
            { name: 'ZaloPay', logo: '📱', supported: true },
            { name: 'VNPay', logo: '📱', supported: true },
            { name: 'Viettel Money', logo: '📱', supported: false },
          ].map((source, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                source.supported ? 'hover:bg-gray-50' : 'opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{source.logo}</span>
                <span className="font-medium">{source.name}</span>
              </div>
              {source.supported ? (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Hỗ trợ
                </span>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Sắp ra mắt
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Lịch sử đồng bộ */}
      {isConnected && (
        <Card className="p-6">
          <h3 className="mb-6">Lịch sử đồng bộ</h3>
          <div className="space-y-3">
            {[
              { date: '14/12/2024 10:30', transactions: 5, status: 'success' },
              { date: '13/12/2024 09:15', transactions: 8, status: 'success' },
              { date: '12/12/2024 14:20', transactions: 3, status: 'success' },
            ].map((sync, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{sync.date}</p>
                  <p className="text-sm text-gray-600">
                    {sync.transactions} giao dịch
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={20} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

