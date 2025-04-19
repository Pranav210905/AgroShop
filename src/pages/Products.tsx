import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { getProducts, type Product } from '../lib/db';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Fruit' | 'Vegetable'>('All');
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category.toLowerCase() === filter.toLowerCase()));
    }
  }, [filter, products]);

  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev;
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, action: 'increment' | 'decrement') => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: action === 'increment' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fresh Products</h1>
        <div className="flex gap-2">
          {['All', 'Fruit', 'Vegetable'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as 'All' | 'Fruit' | 'Vegetable')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const cartItem = cart.find((item) => item.productId === product.id);
          return (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {product.category}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                  ₹{product.price.toFixed(2)} / kg
                </p>

                {cartItem ? (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, 'decrement')}
                      className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      -
                    </button>
                    <span className="text-xl font-medium">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 'increment')}
                      className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product.id)}
                    className="mt-4 block w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <Link
          to="/order"
          state={{ cart }}
          className="fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-lg z-10 flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          Checkout ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </Link>
      )}
    </div>
  );
}

export default Products;
