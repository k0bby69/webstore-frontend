import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext'; // Assuming you have an auth context
import axios from 'axios';

const EditProfileForm = () => {
  const { authState } = useAuth(); // Access the auth context to get the token
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    street: '',
    postalCode: '',
    city: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://webstore-userservice.onrender.com/profile', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        // Populate the form with existing profile data
        setFormData({
          name: response.data.name || '',
          gender: response.data.gender || '',
          street: response.data.street || '',
          postalCode: response.data.postalCode || '',
          city: response.data.city || '',
          country: response.data.country || '',
        });
      } catch (error) {
        setError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [authState.token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission (Update profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('https://webstore-userservice.onrender.com/profile', formData, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      
      if (response.data) {
        // Handle successful profile update (e.g., redirect, show a success message)
        alert('Profile updated successfully!');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 min-h-screen flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>

        {/* Show error message if there's an error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Name field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Gender field */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-lg font-medium mb-2">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Street field */}
          <div className="mb-4">
            <label htmlFor="street" className="block text-lg font-medium mb-2">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Postal Code field */}
          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-lg font-medium mb-2">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* City field */}
          <div className="mb-4">
            <label htmlFor="city" className="block text-lg font-medium mb-2">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Country field */}
          <div className="mb-4">
            <label htmlFor="country" className="block text-lg font-medium mb-2">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full p-3 text-white ${loading ? 'bg-gray-500' : 'bg-indigo-600'} rounded-md`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProfileForm;
