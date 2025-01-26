import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext'; // Adjust the path as necessary
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // For API requests
import { FaUpload } from 'react-icons/fa'; // For upload icon

const ProductForm = () => {
  const { authState } = useAuth();
  const { id } = useParams();
  const navigate  = useNavigate();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState(''); // Cloudinary image URL
  const [type, setType] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false); // Uploading status

  const PRODUCT_CATEGORIES = [
    'Electronics', 'Fashion', 'Home and Kitchen',
    'Health and Personal Care',
    'Books and Stationery',
    'Sports and Outdoors',
    'Toys and Games',
    'Beauty and Cosmetics',
    'Automotive',
     // Add categories as needed
  ];

  // Fetch existing product details if editing
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`https://webstore-productservice.onrender.com/${id}`, {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          });
          const product = response.data;
          setName(product.name);
          setDesc(product.desc);
          setImg(product.img);
          setType(product.type);
          setStock(product.stock);
          setPrice(product.price);
          setAvailable(product.available);
        } catch (error) {
          setError('Failed to fetch product details.');
        }
      };
      fetchProduct();
    }
  }, [id, authState.token]);

// Handle Cloudinary image upload
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setUploading(true); // Show uploading status
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'upload_preset'); // Replace with your Cloudinary preset
  formData.append('cloud_name', 'dqwub0fhb'); // Replace with your Cloudinary cloud name

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dqwub0fhb/image/upload',
      formData
    );
    const uploadedImageUrl = response.data.secure_url;
    console.log('Uploaded Image URL:', uploadedImageUrl); // Log the correct URL immediately
    setImg(uploadedImageUrl); // Update the state with the correct URL
    setUploading(false);
  } catch (error) {
    setError('Image upload failed.');
    setUploading(false);
  }
};
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(name,desc,  img, // Image URL from Cloudinary    type,
      stock,
      price,
      available)

    const productData = {
      name,
      desc,
      img, // Image URL from Cloudinary
      type,
      stock,
      price,
      available,
    };

    try {
      const url = id
        ? `https://webstore-productservice.onrender.com/product/${id}`
        : 'https://webstore-productservice.onrender.com/product/create';
      const method = id ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`,
        },
        data: productData,
      });

      setSuccess(id ? 'Product updated successfully!' : 'Product created successfully!');
      if (!id) {
        setName('');
        setDesc('');
        setImg('');
        setType('');
        setStock(0);
        setPrice(0);
        setAvailable(true);
      }
      navigate('/all-products')
    } catch (error) {
      setError('You are not the seller and do not have the permission to edit this product.');
    }
  };

  if (authState.user.role !== 'Seller') {
    return <p>You are not authorized to view this page.</p>;
  }

  return (<div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
    <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">{id ? 'Edit Product' : 'Create Product'}</h2>
  
    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
  
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
  
      <div>
        <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
  
      <div>
        <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            id="img"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          />
          <FaUpload className="text-gray-500" />
        </div>
        {uploading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}
        {img && <img src={img} alt="Uploaded" className="mt-4 h-24 w-24 object-cover rounded-full" />}
      </div>
  
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="" disabled>Select a category</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
  
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
          Stock
        </label>
        <input
          id="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
  
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
          Price
        </label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
  
      <div>
        <label htmlFor="available" className="block text-sm font-medium text-gray-700 mb-2">
          Available
        </label>
        <input
          id="available"
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="h-5 w-5 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <button
        type="submit"
        className="w-full py-3 bg-black text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
      >
        {id ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  </div>
  
  );
};

export default ProductForm;
