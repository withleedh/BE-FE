import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { userId, password: '***' });
    setError('');
    setIsLoading(true);

    try {
      console.log('Calling login...');
      await login({ userId, password });
      console.log('Login successful!');
      navigate('/diagnostics');
    } catch (err: any) {
      console.error('Login error caught:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      console.log('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hyundai-navy to-hyundai-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">HYUNDAI</h1>
          <p className="text-hyundai-silver text-lg">Engine Diagnostic System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-hyundai-navy p-3 rounded-full">
              <LogIn className="text-white" size={24} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-hyundai-navy mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-navy focus:border-transparent transition-all"
                placeholder="Enter your user ID"
                minLength={3}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-navy focus:border-transparent transition-all"
                placeholder="Enter your password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-hyundai-navy text-white py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For authorized personnel only</p>
          </div>
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>© 2025 Hyundai Motor Company</p>
        </div>
      </div>
    </div>
  );
};

export default Login;