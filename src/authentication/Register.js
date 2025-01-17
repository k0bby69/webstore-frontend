import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Buyer');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('https://webstore-userservice.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    phone,
                    role
                }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            navigate('/login');
        } catch (error) {
            setError(error.message || 'Registration failed');
        }
    };

    return (
        <section 
        className="min-h-screen flex items-center justify-center py-12 px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/lucbags.jpg')" }}
      >
        <div className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-8 space-y-6">
          <a href="#" className="text-3xl font-bold text-center text-gray-900 mb-4">
            MultiVendorApp
          </a>
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Create your account
          </h1>
      
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Your email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
      
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
      
            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
      
            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
      
            {/* Role Select */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-600">Role</label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800"
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
      
            {error && <p className="text-red-500 text-sm">{error}</p>}
      
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
            >
              Create Account
            </button>
      
            <p className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-black hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </section>
      
    );
};

export default Register;
