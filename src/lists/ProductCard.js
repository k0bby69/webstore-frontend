// ProductCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, PlusIcon, MinusIcon, InfoIcon } from 'lucide-react';

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
    <div className="bg-black-300 border border-black-300 rounded-xl p-6 space-y-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden">
  {/* Card Content */}
  <div className="space-y-2">
    <h3 className="text-2xl font-semibold text-black">{product.name}</h3>
    <p className="text-gray-600 text-sm line-clamp-2">{product.desc}</p>
    <div className="flex justify-between items-center">
      <span className="text-xl font-semibold text-black">${product.price}</span>
      <span className={`text-sm font-medium ${product.available ? 'text-green-500' : 'text-red-500'}`}>
        {product.available ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  </div>
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

export default ProductCard;
