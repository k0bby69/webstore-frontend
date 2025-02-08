import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthContext'; // Assuming you have an auth context
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ProfileDetail = () => {
  const { authState } = useAuth(); // Access the auth context to get the token
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch the profile details when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://authenticationservice-gq22.onrender.com/profile', {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setProfileData(response.data); // Assuming the response contains the profile data
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Failed to load profile');
      }
    };

    fetchProfile();
  }, [authState.token]);

  // Render loading or error messages if necessary
  if (!profileData && !error) {
    return <p>Loading profile...</p>;
  }

  const handleEditProfile = () => {
    // Navigate to the '/create-profile' route when the edit button is clicked
    navigate('/edit-profile');
  };

  return (
    <div className="max-w-md mx-auto bg-purple-100 p-8 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-purple-500">Profile Details</h2>

      {/* Show error message if there's an error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Profile details display */}
      {profileData && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-lg">Name:</h3>
            <p className="text-lg">{profileData.name}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-lg">Gender:</h3>
            <p className="text-lg">{profileData.gender}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-lg">Street:</h3>
            <p className="text-lg">{profileData.street}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-lg">Postal Code:</h3>
            <p className="text-lg">{profileData.postalCode}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-lg">City:</h3>
            <p className="text-lg">{profileData.city}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-lg">Country:</h3>
            <p className="text-lg">{profileData.country}</p>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-4">
            <button
              onClick={handleEditProfile}
              className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
