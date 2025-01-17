import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { 
  ShoppingCartIcon, 
  PackageIcon, 
  CreditCardIcon 
} from 'lucide-react';

const Cart = () => {
    const { authState } = useAuth();
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch cart items on component mount
    useEffect(() => {
        if (authState.isAuthenticated) {
            fetchCart();
        }
    }, [authState.isAuthenticated]);

    // Fetch the user's cart items
    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://multivendorplatform-shopping-service.onrender.com/cart', {
                headers: { Authorization: `Bearer ${authState.token}` },
            });
            const data = await response.json();
            setCart(data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch cart');
            setLoading(false);
        }
    };

    // Calculate total cart amount
    const calculateTotal = () => {
        return cart.length > 0 
            ? cart[0].items.reduce((total, item) => total + item.product.price * item.amount, 0).toFixed(2)
            : '0.00';
    };

    // Handle placing the order
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setError('Your cart is empty. Please add items to the cart.');
            return;
        }

        const orderPayload = {
            items: cart[0].items.map(item => ({
                product: { _id: item.product._id },
                amount: item.amount
            })),
            amount: calculateTotal(),
            status: 'Pending',
        };

        try {
            await fetch('https://multivendorplatform-shopping-service.onrender.com/order', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authState.token}` 
                },
                body: JSON.stringify(orderPayload)
            });
            alert('Order placed successfully!');
            fetchCart();
        } catch (err) {
            setError(err.message || 'Failed to place order');
        }
    };

    return (
        <div 
  className="min-h-screen bg-cover bg-center flex items-center justify-center py-12 px-4"
  style={{ backgroundImage: 'url("/lucbags.jpg")' }}
>
  <div className="max-w-6xl w-full bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
    {/* Header */}
    <div className="flex justify-between items-center px-12 py-8">
      <div className="flex items-center space-x-4">
        <ShoppingCartIcon className="w-10 h-10 text-black" />
        <h1 className="text-4xl font-bold text-black">Your Cart</h1>
      </div>
      <span className="text-gray-600">{cart.length > 0 ? `${cart[0].items.length} items` : 'Empty'}</span>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-600 text-white px-8 py-4 rounded-lg text-center mx-12">
        {error}
      </div>
    )}

    {/* Cart Items */}
    <div className="p-12 space-y-12">
      {loading ? (
        <div className="text-center text-gray-600 py-12">
          Loading cart items...
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          <PackageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Your cart is empty</p>
        </div>
      ) : (
        cart[0].items.map((item) => (
          <div
            key={item._id}
            className="flex items-center space-x-12 border-b border-gray-200 py-8 hover:bg-gray-50 transition-all"
          >
            <div className="flex-shrink-0 w-32 h-32">
              <img
                src={item.product.img}
                alt={item.product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex-grow">
              <h3 className="text-2xl font-semibold text-black">{item.product.name}</h3>
              <p className="text-lg text-gray-600">{item.product.desc}</p>
              <div className="flex items-center space-x-6 mt-4">
                <span className="text-lg font-bold text-black">${item.product.price.toFixed(2)}</span>
                <span className="text-gray-500 text-lg">Units: {item.amount}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-black">
                ${(item.product.price * item.amount).toFixed(2)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Order Summary */}
    {cart.length > 0 && (
      <div className="px-12 py-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <CreditCardIcon className="w-6 h-6 text-black" />
            <span className="text-xl font-semibold text-black">Total</span>
          </div>
          <span className="text-3xl font-bold text-black">${calculateTotal()}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="w-full mt-8 py-4 text-xl font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
        >
          Place Order
        </button>
      </div>
    )}
  </div>
</div>

    );
};

export default Cart;
