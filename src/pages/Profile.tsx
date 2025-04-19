import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders, type Order } from '../lib/db';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function Profile() {
  const { user, userProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (user) {
        try {
          const userOrders = await getOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchOrders();
  }, [user]);

  if (!user || !userProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Please <Link to="/login" className="text-primary-600 hover:text-primary-700">sign in</Link> to view your profile.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile</h1>
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Name:</span> {userProfile.name}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Email:</span> {userProfile.email}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Member since:</span>{' '}
            {new Date(userProfile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/track-order?orderId=${order.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Track Order
                  </Link>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Total: ₹{order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;