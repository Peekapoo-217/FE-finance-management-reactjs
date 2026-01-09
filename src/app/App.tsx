import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  User,
  RefreshCw,
  LogOut,
  Wallet
} from 'lucide-react';
import { Dashboard } from './components/pages/Dashboard';
import { TransactionList } from './components/features/transactions/TransactionList';
import { BudgetManager } from './components/features/budgets/BudgetManager';
import { WalletManager } from './components/features/wallets/WalletManager';
import { ReportsPage } from './components/pages/ReportsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { LoginPage } from './components/pages/LoginPage';
import { SyncPage } from './components/pages/SyncPage';
import { Toaster } from './components/ui/feedback/sonner';
import { Button } from './components/ui/interactive/button';
import { TokenManager } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if user is already logged in
  useEffect(() => {
    const token = TokenManager.getToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleDataChange = () => {
    // Trigger refresh for Dashboard when data changes
    setRefreshTrigger(prev => prev + 1);
  };


  const handleLogout = () => {
    TokenManager.removeToken();
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'transactions', label: 'Giao dịch', icon: Receipt },
    { id: 'wallets', label: 'Ví', icon: Wallet },
    { id: 'budgets', label: 'Ngân sách', icon: Target },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
    // { id: 'sync', label: 'Đồng bộ', icon: RefreshCw },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl">Quản Lý Chi Tiêu</h1>
                <p className="text-sm text-gray-600">Theo dõi tài chính cá nhân</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
            >
              <LogOut className="mr-2" size={16} />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-24">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <Dashboard refreshTrigger={refreshTrigger} />
            )}
            {activeTab === 'transactions' && (
              <TransactionList onDataChange={handleDataChange} />
            )}
            {activeTab === 'wallets' && (
              <WalletManager onDataChange={handleDataChange} />
            )}
            {activeTab === 'budgets' && (
              <BudgetManager onDataChange={handleDataChange} />
            )}
            {activeTab === 'reports' && (
              <ReportsPage />
            )}
            {activeTab === 'sync' && <SyncPage />}
            {activeTab === 'profile' && (
              <ProfilePage />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
