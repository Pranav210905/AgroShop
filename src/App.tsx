import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Products from './pages/Products';
import Order from './pages/Order';
import TrackOrder from './pages/TrackOrder';
import Admin from './pages/Admin';
import AdminInventory from './pages/AdminInventory';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

import { OrderProvider } from './context/OrderContext'; // ⬅️ import this

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <OrderProvider> {/* ⬅️ Wrap here */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Products />} />
                <Route path="order" element={<Order />} />
                <Route path="track-order" element={<TrackOrder />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="admin"
                  element={
                    <PrivateRoute>
                      <Admin />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="admin/inventory"
                  element={
                    <PrivateRoute>
                      <AdminInventory />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}


export default App;