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
      console.log('Auth State:', authState);
        if (authState.isAuthenticated) {
            fetchCart();
        }
    }, [authState.isAuthenticated]);

    // Fetch the user's cart items
    setLoading(true);
    try {
        const response = await fetch('https://webstore-orderservice.onrender.com/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState.token}`,
            },
        });

        console.log("Fetching cart for user:", user._id);

        if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Cart Data:', data);

        if (!data || !Array.isArray(data.items) || data.items.length === 0) {
            setCart([]);
            setError('No items in the cart');
        } else {
            setCart([data]);
        }

    } catch (err) {
        setError(err.message || 'Failed to fetch cart');
    } finally {
        setLoading(false);
    }
};



    // Calculate total cart amount
   const calculateTotal = () => {
    if (!cart.length || !cart[0].items) {
        return '0.00';
    }

    return cart[0].items
        .reduce((total, item) => total + (item.product?.price || 0) * (item.amount || 0), 0)
        .toFixed(2);
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
            await fetch('https://webstore-orderservice.onrender.com/order', {
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-white/20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <ShoppingCartIcon className="w-8 h-8 text-blue-300" />
                        <h1 className="text-3xl font-bold text-white">Your Cart</h1>
                        <span className="text-white/75">{cart.length > 0 ? `${cart[0].items.length} items` : 'Empty'}</span>
                    </div>
                    {error && (
                        <div className="bg-red-600/50 text-white px-4 py-2 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center text-white/75 py-12">
                            Loading cart items...
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="text-center text-white/75 py-12">
                            <PackageIcon className="w-16 h-16 mx-auto mb-4 text-white/50" />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart[0].items.map((item) => (
                                <div 
                                    key={item._id} 
                                    className="bg-white/10 rounded-lg p-4 flex items-center space-x-4 hover:bg-white/20 transition-all"
                                >
                                    <img 
                                        src={item.product.img} 
                                        alt={item.product.name} 
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-white">{item.product.name}</h3>
                                        <p className="text-white/75">{item.product.desc}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-blue-300 font-semibold">
                                                ${item.product.price.toFixed(2)}
                                            </span>
                                            <span className="text-white bg-white/10 px-3 py-1 rounded-full">
                                                Units: {item.amount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xl font-bold text-green-300">
                                            ${(item.product.price * item.amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {cart.length > 0 && (
                    <div className="bg-white/20 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <CreditCardIcon className="w-6 h-6 text-blue-300" />
                                <span className="text-xl font-semibold text-white">Total</span>
                            </div>
                            <span className="text-2xl font-bold text-green-300">
                                ${calculateTotal()}
                            </span>
                        </div>
                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full mt-4 bg-blue-600/70 text-white py-3 rounded-full 
                            hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <PackageIcon className="w-6 h-6" />
                            <span>Place Order</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
