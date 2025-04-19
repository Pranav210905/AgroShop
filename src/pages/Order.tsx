import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder, getProducts, type Product } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = location.state?.cart || [];

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<(Product & { quantity: number })[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    async function fetchSelectedProducts() {
      try {
        const allProducts = await getProducts();
        const selectedProducts = cart.map((item: { productId: string; quantity: number }) => {
          const product = allProducts.find(p => p.id === item.productId);
          return product ? { ...product, quantity: item.quantity } : null;
        }).filter(Boolean) as (Product & { quantity: number })[];

        setProducts(selectedProducts);
      } catch (error) {
        console.error('Failed to fetch cart products:', error);
      }
    }

    fetchSelectedProducts();
  }, [cart]);

  const deliveryCharge = 12;
  const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) return;

    setLoading(true);

    try {
      const order = await createOrder({
        userId: user?.uid || 'anonymous',
        customerName: formData.name,
        customerEmail: formData.email,
        deliveryAddress: formData.address,
        deliveryCharge,
        totalPrice,
        items: products.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          pricePerUnit: p.price
        }))
      });

      navigate(`/track-order?orderId=${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Your Order</h1>

      {products.map((product) => (
        <div key={product.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{product.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">{product.category}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {product.quantity} kg</p>
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
            ₹{(product.price * product.quantity).toFixed(2)}
          </p>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Delivery Address
          </label>
          <textarea
            id="address"
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
            Total Price: ₹{totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Delivery Charge: ₹{deliveryCharge}</p>
        </div>

        <button
          type="submit"
          disabled={loading || products.length === 0}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Order;
