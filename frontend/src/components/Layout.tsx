import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-hyundai-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">HYUNDAI</div>
            <div className="text-sm text-hyundai-silver">
              Engine Diagnostic System
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span className="text-sm">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-hyundai-dark text-hyundai-silver py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 Hyundai Motor Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;