import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { fetchProducts,fetchProductsByCategory, updateLocalStorageWishlist, updateLocalStorageCart, addToWishlist, removeFromWishlist, addToCart, removeFromCart } from '../services/ProductServices';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  PlusIcon, 
  MinusIcon, 
  InfoIcon 
} from 'lucide-react';

const ProductCard = ({ 
  product, 
  isInWishlist, 
  isInCart, 
  onAddToWishlist, 
  onRemoveFromWishlist, 
  onAddToCart, 
  onRemoveFromCart,
  loadingWishlist,
  loadingCart 
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
    
  };

  return (
    
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 
    rounded-2xl p-6 space-y-4 transform transition-all duration-300 
    hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-48 object-cover rounded-lg 
          group-hover:scale-110 transition-transform duration-300"
        />
        <Link 
          to={`/product/${product._id}`} 
          className="absolute top-2 right-2 bg-white/20 p-2 rounded-full 
          hover:bg-white/40 transition-all duration-300"
        >
          <InfoIcon className="w-5 h-5 text-white" />
        </Link>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white truncate">{product.name}</h3>
        <p className="text-white/75 line-clamp-2">{product.desc}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-300">${product.price}</span>
          <span className={`text-sm ${product.available ? 'text-green-400' : 'text-red-400'}`}>
            {product.available ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Wishlist Button */}
        <button
          onClick={isInWishlist ? onRemoveFromWishlist : onAddToWishlist}
          disabled={loadingWishlist}
          className={`flex items-center justify-center space-x-2 py-2 rounded-full 
          transition-all duration-300 ${
            isInWishlist 
              ? 'bg-red-600/70 text-white hover:bg-red-700' 
              : 'bg-white/10 text-white hover:bg-white/20'
          } 
          disabled:opacity-50`}
        >
          <HeartIcon 
            className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} 
          />
          <span>{loadingWishlist ? 'Processing...' : (isInWishlist ? 'Remove' : 'Wishlist')}</span>
        </button>

        {/* Cart Button */}
        {isInCart ? (
          <button
            onClick={onRemoveFromCart}
            disabled={loadingCart}
            className="flex items-center justify-center space-x-2 py-2 
            bg-red-600/70 text-white rounded-full hover:bg-red-700 
            disabled:opacity-50"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>{loadingCart ? 'Processing...' : 'Remove'}</span>
          </button>
        ) : (
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <div className="flex items-center bg-white/10 rounded-full">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-white/20 rounded-l-full"
              >
                <MinusIcon className="w-4 h-4 text-white" />
              </button>
              <span className="px-3 text-white">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-white/20 rounded-r-full"
              >
                <PlusIcon className="w-4 h-4 text-white" />
              </button>
            </div>
            <button
              onClick={() => onAddToCart(quantity)}
              disabled={loadingCart}
              className="flex items-center justify-center space-x-2 py-2 
              bg-blue-600/70 text-white rounded-full hover:bg-blue-700 
              disabled:opacity-50"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>{loadingCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductList = () => {
  const { authState } = useAuth();
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(new Map());
  const [loadingCart, setLoadingCart] = useState(new Map());

  // Previous useEffect and helper functions remain the same as in the original component
  // ... (keep the existing localStorage, fetch, and action methods)
  // Initialize wishlist and cart from localStorage
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(new Set(Array.isArray(storedWishlist) ? storedWishlist : []));
  
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(new Set(Array.isArray(storedCart) ? storedCart : []));
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch(`https://webstore-productservice.onrender.com/category/${type}`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`, // Include the token in the headers
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products by category');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch products by category');
      }
    };

    fetchProductsByCategory();
  }, [type, authState.token]); // Dependency on token

  // Save wishlist to localStorage
  const updateLocalStorageWishlistFromService = (updatedWishlist) => {
    updateLocalStorageWishlist(updatedWishlist);
  };

  // Save cart to localStorage
  const updateLocalStorageCartFromService = (updatedCart) => {
    updateLocalStorageCart(updatedCart);
  };

  // Add product to wishlist
  const addToWishlistFromService = async (productId) => {
    setLoadingWishlist((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      const response = await addToWishlist(productId, authState.token);
      console.log('Product added to wishlist:', response.data);
      setWishlist((prev) => {
        const updatedWishlist = new Set(prev).add(productId); // Update wishlist state
        updateLocalStorageWishlistFromService(updatedWishlist); // Update localStorage
        return updatedWishlist;
      });
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    } finally {
      setLoadingWishlist((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
    }
  };

  // Remove product from wishlist
  const removeFromWishlistFromService = async (productId) => {
    setLoadingWishlist((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      const response = await removeFromWishlist(productId, authState.token);
      console.log('Product removed from wishlist:', response.data);
      setWishlist((prev) => {
        const updatedWishlist = new Set(prev);
        updatedWishlist.delete(productId); // Update wishlist state
        updateLocalStorageWishlistFromService(updatedWishlist); // Update localStorage
        return updatedWishlist;
      });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    } finally {
      setLoadingWishlist((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
    }
  };

  // Add product to cart with quantity
  const addToCartFromService = async (productId, quantity) => {
    setLoadingCart((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      console.log('QUANTITYYYY',quantity)
      const response = await addToCart(productId, quantity, authState.token);
     
      console.log('Product added to cart:', response.data);
      console.log('QUANTITYYYYY')
      console.log(quantity)
      setCart((prev) => {
        const updatedCart = new Set(prev).add(productId); // Update cart state
        updateLocalStorageCartFromService(updatedCart); // Update localStorage
        return updatedCart;
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setLoadingCart((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
    }
  };

  // Remove product from cart
  const removeFromCartFromService = async (productId) => {
    setLoadingCart((prev) => new Map(prev).set(productId, true)); // Set loading state for the product
    try {
      const response = await removeFromCart(productId, authState.token);
      console.log('Product removed from cart:', response.data);
      setCart((prev) => {
        const updatedCart = new Set(prev);
        updatedCart.delete(productId); // Update cart state
        updateLocalStorageCartFromService(updatedCart); // Update localStorage
        return updatedCart;
      });
    } catch (error) {
      console.error('Error removing product from cart:', error);
    } finally {
      setLoadingCart((prev) => {
        const updatedLoading = new Map(prev);
        updatedLoading.delete(productId); // Clear loading state
        return updatedLoading;
      });
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
                {cart.length > 0 ? ${cart[0].items.length} items : "Empty"}
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
              ) : cart.length === 0  !cart[0]?.items?.length ? (
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
                        src={item.product?.img  "/placeholder-image.jpg"} // Fallback image
                        alt={item.product?.name  "Product Image"}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
    
                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold">
                        {item.product?.name  "Unnamed Product"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.product?.desc  "No description available"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold">
                          ${item.product?.price?.toFixed(2)  "0.00"}
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

export default ProductList;
