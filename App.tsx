
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { storageService } from './services/storageService';
import { AuthPage } from './pages/AuthPage';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LogOut, LayoutDashboard, Building2, ShieldCheck, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (user) setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgMain flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold">易宿加载中...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-bgMain">
      {/* Navigation Header */}
      <nav className="bg-primary text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="text-accent" />
              <span className="text-xl font-bold tracking-widest">易宿 YISU</span>
              <span className="ml-4 px-2 py-0.5 bg-secondary/30 rounded text-xs border border-white/10 flex items-center gap-1">
                {currentUser.role === UserRole.ADMIN ? <ShieldCheck size={12}/> : <Building2 size={12}/>}
                {currentUser.role === UserRole.ADMIN ? '管理员系统' : '商户工作台'}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-white/20">
                  <UserIcon size={16} />
                </div>
                <span className="text-sm font-medium">{currentUser.username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm hover:text-accent transition-colors"
              >
                <LogOut size={16} />
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {currentUser.role === UserRole.MERCHANT ? (
          <MerchantDashboard user={currentUser} />
        ) : (
          <AdminDashboard user={currentUser} />
        )}
      </main>

      <footer className="mt-12 py-8 border-t border-borderLight text-center text-gray-400 text-sm">
        <p>© 2024 易宿 (YiSu) 酒店信息管理平台 - 值得信赖的酒店管理专家</p>
      </footer>

      {/* Tailwind animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
