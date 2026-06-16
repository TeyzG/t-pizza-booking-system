import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(username, password);
      onLoginSuccess?.();
    } catch (err) {
      // Error is already set in context
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register(registerData);
      onLoginSuccess?.();
    } catch (err) {
      // Lỗi được xử lý bởi AuthContext
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isRegistering) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h2>
            <p className="text-gray-600 mb-6">Tạo tài khoản mới để đặt bàn</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={registerData.first_name}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={registerData.last_name}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  value={registerData.password_confirm}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 transition"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>

            <button
              onClick={() => setIsRegistering(false)}
              className="w-full mt-4 text-orange-600 font-medium hover:text-orange-700"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-orange-600 p-3 rounded-lg">
              <LogIn className="text-white" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">T'Pizza</h1>
          <p className="text-gray-600 text-center mb-8">Hệ thống đặt bàn trực tuyến</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập tên đăng nhập"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 transition"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm text-center mb-3">
              Chưa có tài khoản?
            </p>
            <button
              onClick={() => setIsRegistering(true)}
              className="w-full px-4 py-2 border border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition"
            >
              Đăng ký ngay
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-2">Demo Accounts:</p>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Staff:</strong> staff_1 / staff123</p>
              <p><strong>Customer:</strong> customer_1 / customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
