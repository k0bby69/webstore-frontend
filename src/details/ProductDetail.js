import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { deleteProduct } from '../services/ProductServices';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [product, setProduct] = useState(null);
  const [sellerName, setSellerName] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductAndSellerDetails = async () => {
      try {
        const productResponse = await fetch(`https://productsservice-gwhp.onrender.com/${id}`, {
          headers: { 'Authorization': `Bearer ${authState.token}` },
        });
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product details');
        }
        const productData = await productResponse.json();
        setProduct(productData);

        if (productData.seller) {
          try {
            const sellerResponse = await fetch(`https://webstore-userservice.onrender.com/product/seller/${productData.seller}`, {
              headers: { 'Authorization': `Bearer ${authState.token}` },
            });
            if (!sellerResponse.ok) {
              throw new Error('Failed to fetch seller details');
            }
            const sellerData = await sellerResponse.json();
            setSellerName(sellerData.name || 'Name not available');
          } catch {
            setSellerName('Seller name not available');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      }
    };

    fetchProductAndSellerDetails();
  }, [id, authState.token]);

  const handleEditClick = () => navigate(`/edit-product/${id}`);

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id, authState.token);
        alert('Product deleted successfully');
        navigate('/products');
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!product) return <p className="text-white text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 py-12 px-6 relative">
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-4xl bg-white/10 rounded-lg p-6 shadow-md">
        <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
          {product.name}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          <img
            src={product.img}
            alt={product.name}
            className="w-full lg:w-1/2 h-auto object-cover rounded-lg"
          />

          <div className="flex-1">
            <p className="text-white text-lg mb-4">{product.desc}</p>
            <p className="text-2xl font-bold text-blue-300 mb-2">Price: ${product.price}</p>
            <p className="text-white mb-2">Type: {product.type}</p>
            <p className="text-white mb-2">Available: {product.available ? 'Yes' : 'No'}</p>
            <p className="text-white mb-2">Stock: {product.stock}</p>
            <p className="text-white mb-2">Seller: {sellerName}</p>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handleEditClick}
            className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Edit Product
          </button>
          <button
            onClick={handleDeleteClick}
            className="py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
