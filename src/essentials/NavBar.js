import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  PlusSquareIcon, 
  LogOutIcon, 
  UserIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';

// Product categories configuration




const NavBar = () => {
  const { authState, dispatch } = useAuth();
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
            to="/all-products" 
            className="flex items-center space-x-2 text-black hover:bg-yellow-200/30 px-3 py-2 transition-all duration-200"
          >
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>


          <Link 
            to="/cart" 
            className="flex items-center space-x-2 text-black hover:bg-yellow-200/30 px-3 py-2  transition-all duration-200"
          >
            <ShoppingCartIcon size={18} />
            <span>Cart</span>
          </Link>

          <Link 
            to="/add-product" 
            className="flex items-center space-x-2 text-black hover:bg-yellow-200/30 px-3 py-2 transition-all duration-200"
          >
            <PlusSquareIcon size={18} />
            <span>Add Product</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-black hover:bg-yellow-700/30 px-3 py-2  transition-all duration-200"
          >
            <LogOutIcon size={18} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
        
        </>
      )}
    </>
  );

  return (
    <nav className="bg-grey p-0 shadow-md relative">
      <div className="max-w-8xl mx-auto flex justify-center items-center space-x-24">
  {/* Desktop Navigation */}
  <div className="hidden md:flex items-center space-x-8">
    <NavLinks className="text-2xl  text-black" />
  </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-black focus:outline-none"
          >
            {isMobileMenuOpen ? <XIcon size={10} /> : <MenuIcon size={10} />}
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
