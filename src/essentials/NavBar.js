import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  PackageIcon, 
  PlusSquareIcon, 
  LogOutIcon, 
  UserIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';

// Product categories configuration
const PRODUCT_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Kitchen', 
  'Health & Personal Care', 'Books & Stationery', 
  'Sports & Outdoors', 'Toys & Games', 
  'Beauty & Cosmetics', 'Automotive', 
  'Jewelry & Accessories', 'Groceries & Food', 
  'Baby Products', 'Pet Supplies', 
  'Tools & Hardware', 'Office Supplies', 
  'Musical Instruments', 'Furniture', 
  'Art & Craft', 'Industrial & Scientific', 
  'Video Games', 'Music'
];

const ProductDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl z-50 border border-blue-100"
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-4 gap-2 p-4 max-h-96 overflow-y-auto">
        {PRODUCT_CATEGORIES.map((category) => (
          <Link 
            key={category} 
            to={`/products/${category.replace(/\s+/g, '-')}`} 
            className="text-xs text-gray-700 hover:bg-blue-50 p-2 rounded text-center transition-all duration-200 ease-in-out"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

const NavBar = () => {
  const { authState, dispatch } = useAuth();
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      {authState.isAuthenticated ? (
        <>
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200"
          >
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>

          <div className="relative">
            <button 
              onMouseEnter={() => setProductDropdownOpen(true)}
              className="flex items-center space-x-2 text-white hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200"
            >
              <PackageIcon size={18} />
              <span>Products</span>
            </button>
            <ProductDropdown 
              isOpen={isProductDropdownOpen}
              onClose={() => setProductDropdownOpen(false)}
            />
          </div>

          <Link 
            to="/cart" 
            className="flex items-center space-x-2 text-white hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200"
          >
            <ShoppingCartIcon size={18} />
            <span>Cart</span>
          </Link>

          <Link 
            to="/add-product" 
            className="flex items-center space-x-2 text-white hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200"
          >
            <PlusSquareIcon size={18} />
            <span>Add Product</span>
          </Link>

          <Link 
            to="/all-products" 
            className="flex items-center space-x-2 text-white hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200"
          >
            <PlusSquareIcon size={18} />
            <span>All Products</span>
          </Link>

          <Link 
            to="/view-profile" 
            className="flex items-center space-x-2 text-white hover:bg-blue-700/30 px-3 py-2 rounded-md transition-all duration-200"
          >
            <UserIcon size={18} />
            <span>View Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white hover:bg-red-700/30 px-3 py-2 rounded-md transition-all duration-200"
          >
            <LogOutIcon size={18} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            <button className="flex items-center space-x-2 text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md transition-all duration-200">
              <UserIcon size={18} />
              <span>Login</span>
            </button>
          </Link>
          <Link to="/register">
            <button className="flex items-center space-x-2 text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded-md transition-all duration-200">
              <UserIcon size={18} />
              <span>Register</span>
            </button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-blue-600 p-4 shadow-md relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="MultiVendorApp" 
            className="h-8 w-8 rounded-full mr-2" 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          MultiVendorApp
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-blue-600 z-50">
          <div className="flex flex-col space-y-2 p-4">
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
