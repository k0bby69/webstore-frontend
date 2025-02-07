import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { Link } from 'react-router-dom';
import { fetchProducts, updateLocalStorageWishlist, updateLocalStorageCart, addToWishlist, removeFromWishlist, addToCart, removeFromCart } from '../services/ProductServices';
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
    
    <div className="bg-transparent/10 backdrop-blur-lg border border-black/10 
    rounded-2xl p-5 space-y-4 transform transition-all duration-300 
    hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-48 object-cover rounded- 
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
  <div className="space-y-4">
    <h3 className="text-2xl font-semibold text-black">{product.name}</h3>
    <p className="text-gray-600 text-sm line-clamp-2">{product.desc}</p>
    <div className="flex justify-between items-center">
      <span className="text-xl font-semibold text-black">${product.price}</span>
      <span className={`text-sm font-medium ${product.available ? 'text-green-500' : 'text-red-500'}`}>
        {product.available ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  </div>

     {/* Action Buttons */}
<div className="grid grid-cols-1 gap-4 w-full">
  {isInCart ? (
    <button
      onClick={onRemoveFromCart}
      disabled={loadingCart}
      className="w-full py-3 bg-black text-white rounded-md text-lg hover:bg-gray-800 transition duration-200 disabled:opacity-50"
    >
      <ShoppingCartIcon className="w-5 h-5 inline-block mr-2" />
      <span>{loadingCart ? 'Processing...' : 'Remove from Cart'}</span>
    </button>
  ) : (
    <>
      {/* Quantity Selector */}
      <div className="flex justify-center items-center bg-gray-100 rounded-md">
        <button 
          onClick={() => handleQuantityChange(-1)}
          className="w-8 py-2 text-black hover:bg-gray-200 rounded-l-md transition"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="px-4 text-black">{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(1)}
          className="w-8 py-2 text-black hover:bg-gray-200 rounded-r-md transition"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(quantity)}
        disabled={loadingCart}
        className="w-full py-2 bg-black text-white rounded-md text-lg hover:bg-gray-800 transition duration-200 disabled:opacity-50"
      >
        <ShoppingCartIcon className="w-5 h-5 inline-block mr-2" />
        <span>{loadingCart ? 'Adding...' : 'Add to Cart'}</span>
      </button>
    </>
  )}
</div>

</div>
  );
};

const ProductList = () => {
  const { authState } = useAuth();
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
    const fetchProductsFromService = async () => {
      try {
        const data = await fetchProducts(authState.token);
        console.log('Fetched Products:', data);
        setProducts(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch products');
      }
    };

    fetchProductsFromService();
  }, [authState.token]); // Dependency on token

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
    <div className="min-h-screen bg-grey 
    py-12 px-6 relative overflow-hidden">


      <div className="container mx-auto">
      <div 
  className="w-full h-48 bg-cover bg-center mb-12"
  style={{ backgroundImage: "url('lucbags.jpg')" }}
>
  <div className="flex items-center justify-center w-full h-full ">
    <h1 className="text-3xl font-extrabold text-white">
      All Products Available
    </h1>
  </div>
</div>


        {error && (
          <div className="bg-red-600/30 text-white p-4 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center text-white/75">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isInWishlist={wishlist.has(product._id)}
                isInCart={cart.has(product._id)}
                onAddToWishlist={() => addToWishlistFromService(product._id)}
                onRemoveFromWishlist={() => removeFromWishlistFromService(product._id)}
                onAddToCart={(quantity) => addToCartFromService(product._id, quantity)}
                onRemoveFromCart={() => removeFromCartFromService(product._id)}
                loadingWishlist={loadingWishlist.get(product._id)}
                loadingCart={loadingCart.get(product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
