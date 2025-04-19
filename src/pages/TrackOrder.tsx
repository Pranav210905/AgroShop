import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getOrder, type Order } from '../lib/db';
import { Loader2, MapPin, Package, Truck, CheckCircle } from 'lucide-react';

function TrackOrder() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrder(orderId!);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order not found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please check your order ID and try again.</p>
      </div>
    );
  }

  const steps = [
    { status: 'pending', icon: Package, label: 'Order Placed' },
    { status: 'processing', icon: Truck, label: 'Processing' },
    { status: 'shipped', icon: MapPin, label: 'Out for Delivery' },
    { status: 'delivered', icon: CheckCircle, label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(step => step.status === order.status);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track Your Order</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Order #{order.id}
          </h2>
          
          <div className="relative">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.status} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
              <div
                className="h-full bg-primary-600 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Details</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{order.customerName}</p>
              <p className="text-gray-600 dark:text-gray-400">{order.deliveryAddress}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Estimated Delivery</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {new Date(order.estimatedDelivery).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;