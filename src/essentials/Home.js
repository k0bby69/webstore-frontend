import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../authentication/AuthContext';
import PrivateRoute from '../routes/PrivateRoute';
import ProductForm from '../forms/ProductForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from '../lists/ProductList';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  LogOutIcon,
  ArrowRightIcon,
} from 'lucide-react';
import Cart from '../lists/Cart';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      delayChildren: 0.3,
      staggerChildren: 0.2 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      damping: 12,
      stiffness: 100 
    }
  }
};

const FeatureCard = ({ icon, title, description, linkTo, linkText }) => (
  <motion.div 
    variants={itemVariants}
    className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4 overflow-hidden"
  >
    <div className="flex items-center justify-between">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white/20 p-3 rounded-full"
      >
        {icon}
      </motion.div>
      <Link 
        to={linkTo} 
        className="text-blue-200 hover:text-white transition-colors flex items-center gap-1"
      >
        {linkText}
        <ArrowRightIcon size={16} className="opacity-70" />
      </Link>
    </div>
    <div>
      <h4 className="text-xl font-bold text-white mb-2 tracking-wide">{title}</h4>
      <p className="text-white/75 text-sm whitespace-pre-line leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const LoggedOutHome = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
    {/* Left Section */}
<div className="flex-1 bg-gray-100 flex items-center justify-center bg-cover bg-left h-400" style={{ backgroundImage: 'url(lucbags.jpg)' }}>
 
</div>

  {/* Right Section */}
  <div className="flex-1 bg-white flex items-center justify-center p-8">
    <div className="w-full max-w-lg">

    <div className="max-w-lg text-center text-black p-6">
    <h1 className="text-5xl font-bold text-black mb-4">
      Turn Your Ideas into Reality
    </h1>
    <p className="text-black">
      Start for free and get attractive offers from the community.
    </p>
  </div>

    <Link 
  to="/login"
  className="mx-8 max-w-md bg-black text-white p-3 rounded-lg hover:bg-gray-800 text-center block"
>
  Log In
</Link>
<Link
  to="/register"
  className="mx-8 max-w-md mt-4 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 text-center block"
>
  Register
</Link>


    </div>
  </div>


  </div>
);
};


const Home = () => {
  const { authState, dispatch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authState.isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('https://webstore-userservice.onrender.com/profile', {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            dispatch({ type: 'LOGOUT' });
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authState.token, authState.isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const fetchCart = async () => {
    if (!authState.isAuthenticated) {
      setError('You must be logged in to view your cart.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://webstore-userservice.onrender.com/cart', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      // Assuming there's a function to set the cart state
      // setCart(data); // This line is commented out as it's not defined in this context
    } catch (error) {
      setError(error.message || 'Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  };

  if (!authState.isAuthenticated) {
    return <LoggedOutHome />;
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { 
              repeat: Infinity, 
              duration: 1 
            } 
          }}
          className="text-white text-2xl"
        >
          Loading...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <Routes>
<Route
    path="/add-product"
    element={
        <PrivateRoute>
            <ProductForm />
        </PrivateRoute>
    }
/>
    </Routes>
    
  );
};

export default Home;