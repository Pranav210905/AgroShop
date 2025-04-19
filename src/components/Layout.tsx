import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, ShoppingBasket, Truck, ClipboardList, Settings, LogOut } from 'lucide-react';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-primary-600 dark:bg-primary-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBasket />
            <span>GreenGrocer</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-primary-200 flex items-center gap-1">
              <ShoppingBasket size={20} />
              <span>Products</span>
            </Link>
            <Link to="/order" className="hover:text-primary-200 flex items-center gap-1">
              <ClipboardList size={20} />
              <span>Order</span>
            </Link>
            <Link to="/track-order" className="hover:text-primary-200 flex items-center gap-1">
              <Truck size={20} />
              <span>Track</span>
            </Link>
            {user ? (
              <>
                <Link to="/admin" className="hover:text-primary-200 flex items-center gap-1">
                  <Settings size={20} />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-200 flex items-center gap-1"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-primary-200 flex items-center gap-1">
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary-700 dark:hover:bg-primary-800"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-primary-600 dark:bg-primary-900 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 GreenGrocer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;