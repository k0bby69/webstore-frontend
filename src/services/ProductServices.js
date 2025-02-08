import axios from 'axios';


const API_URL = 'https://webstore-productservice.onrender.com/';

export const fetchProducts = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch products');
  }
};

export const deleteProduct = async (someProductId, token) => {
  try {
    const response = await axios.delete(`${API_URL}product/${someProductId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    throw new Error('Error deleting the product: You cannot DELETE this Product; it does not belong to you');
  }
};


export const fetchProductsByCategory = async (token, type) => {
  try {
    const response = await fetch(`${API_URL}category/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by category')
    }
    
    const data = await response.json();
    return data; // Directly return the data, not data.products
  } catch (error) {
    throw new Error(error.message || 'failed to fetch products by category')
  }
}

export const updateLocalStorageWishlist = (updatedWishlist) => {
  localStorage.setItem('wishlist', JSON.stringify(Array.from(updatedWishlist)));
};

export const updateLocalStorageCart = (updatedCart) => {
  localStorage.setItem('cart', JSON.stringify(Array.from(updatedCart)));
};

export const addToWishlist = async (productId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}wishlist`,
      { _id: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error adding product to wishlist: ' + error.message);
  }
};

export const removeFromWishlist = async (productId, token) => {
  try {
    const response = await axios.delete(`${API_URL}wishlist/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error removing product from wishlist: ' + error.message);
  }
};

export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await axios.put(
      `${API_URL}cart`,
      { productId, amount: quantity },  // Send productId directly, not { product: { _id: productId } }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("Cart updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding product to cart:", error.response?.data || error.message);
    throw new Error("Error adding product to cart: " + error.message);
  }
};


export const removeFromCart = async (productId, token) => {
  try {
    const response = await axios.delete(`${API_URL}cart/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error removing product from cart: ' + error.message);
  }
};

export const fetchWishlist = async (token) => {
  try {
    const response = await axios.get(`${API_URL}wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error) {
    throw new Error('Error fetching wishlist: ' + error.message);
  }
};
