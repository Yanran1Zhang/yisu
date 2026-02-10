
import React, { useState } from 'react';
import { UserRole } from '../types';
import { storageService } from '../services/storageService';
import { Button, Input, Label, Card } from '../components/UI';
import { LogIn, UserPlus, Building2, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.MERCHANT);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const users = storageService.getUsers();
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        storageService.setCurrentUser(user);
        onLoginSuccess(user);
      } else {
        setError('用户名或密码错误');
      }
    } else {
      const users = storageService.getUsers();
      if (users.some(u => u.username === username)) {
        setError('用户名已存在');
        return;
      }
      const newUser = { id: Date.now().toString(), username, password, role };
      storageService.saveUser(newUser);
      storageService.setCurrentUser(newUser);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgMain p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-primary">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-widest">易宿 YISU</h1>
          <p className="text-gray-500 mt-2">{isLogin ? '欢迎登录管理系统' : '创建您的商户或管理账户'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label required>用户名</Label>
            <Input 
              placeholder="请输入用户名" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <Label required>密码</Label>
            <Input 
              type="password" 
              placeholder="请输入密码" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          {!isLogin && (
            <div>
              <Label>选择角色</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.MERCHANT)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-all ${role === UserRole.MERCHANT ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-borderLight'}`}
                >
                  <Building2 size={18} />
                  <span>商户</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.ADMIN)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-all ${role === UserRole.ADMIN ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-borderLight'}`}
                >
                  <ShieldCheck size={18} />
                  <span>管理员</span>
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-danger text-sm text-center">{error}</p>}

          <Button type="submit" className="w-full" size="lg">
            {isLogin ? (
              <><LogIn size={18} className="mr-2" /> 立即登录</>
            ) : (
              <><UserPlus size={18} className="mr-2" /> 注册账号</>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-secondary hover:underline text-sm font-medium"
          >
            {isLogin ? '没有账号？立即注册' : '已有账号？返回登录'}
          </button>
        </div>
      </Card>
    </div>
  );
};
