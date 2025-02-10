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
            const response = await fetch('https://webstore-orderservice.onrender.com/cart', {
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
            await fetch('https://webproject-orderservice.onrender.com/order', {
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
          style={{ backgroundImage: 'url("/path-to-your-background-image.jpg")' }} // Replace with actual image path
        >
          <div className="max-w-4xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-black text-white px-8 py-6 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <ShoppingCartIcon className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold">Your Cart</h1>
              </div>
              <span className="text-lg">
                {cart.length > 0 ? `${cart[0].items.length} items` : "Empty"}
              </span>
            </div>
    
            {/* Error Message */}
            {error && (
              <div className="bg-red-600 text-white px-6 py-4 text-center">
                {error}
              </div>
            )}
    
            {/* Cart Items */}
            <div className="p-8 space-y-6">
              {loading ? (
                <div className="text-center text-gray-500 py-12">
                  Loading cart items...
                </div>
              ) : cart.length === 0 || !cart[0]?.items?.length ? (
                <div className="text-center text-gray-500 py-12">
                  <PackageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart[0].items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-6 border-b border-gray-300 pb-6"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24">
                      <img
                        src={item.product?.img || "/placeholder-image.jpg"} // Fallback image
                        alt={item.product?.name || "Product Image"}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
    
                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold">
                        {item.product?.name || "Unnamed Product"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.product?.desc || "No description available"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold">
                          ${item.product?.price?.toFixed(2) || "0.00"}
                        </span>
                        <span className="text-gray-500">Units: {item.amount}</span>
                      </div>
                    </div>
    
                    {/* Item Total */}
                    <div className="text-right">
                      <span className="text-lg font-bold">
                        ${(item.product?.price * item.amount).toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
    
            {/* Order Summary */}
            {cart.length > 0 && cart[0]?.items?.length > 0 && (
              <div className="bg-gray-100 px-8 py-6 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-2xl font-bold">${calculateTotal()}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 py-3 text-lg font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition"
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
