import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './authentication/AuthContext';
import './App.css'; // Or './tailwind.css', depending on your setup
import PrivateRoute from './routes/PrivateRoute';
import RestrictedRoute from './routes/RestrictedRoute';

import NavBar from './essentials/NavBar';
import Home from './essentials/Home';

import CreateProfileForm from './forms/CreateProfileForm';
import EditProfileForm from './forms/EditProfileForm';
import ProfileDetail from './details/ProfileDetail';

import ProductForm from './forms/ProductForm';
import Wishlist from './lists/Wishlist';
import ProductList from './lists/ProductList';
import ProductDetail from './details/ProductDetail';
import ProductsByCategoryList from './lists/ProductsByCategoryList';

import Login from './authentication/Login';
import Register from './authentication/Register';
import Cart from './lists/Cart';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                {/* NavBar is displayed on all pages */}
                
                <Routes>
                    {/* Public Route */}
                    <Route path="/" element={<Home />} />

                    {/* Restricted Routes for public-only access */}
                    <Route
                        path="/login"
                        element={
                            <RestrictedRoute>
                                <Login />
                            </RestrictedRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <RestrictedRoute>
                                <Register />
                            </RestrictedRoute>
                        }
                    />
                  
                           <Route
                        path="/create-profile"
                        element={
                            <PrivateRoute>
                                <CreateProfileForm />
                            </PrivateRoute>
                        }
                    />
                           <Route
                        path="/edit-profile"
                        element={
                            <PrivateRoute>
                                <EditProfileForm />
                            </PrivateRoute>
                        }
                    />
                          <Route
                        path="/view-profile"
                        element={
                            <PrivateRoute>
                                <ProfileDetail />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/add-product"
                        element={
                            <PrivateRoute>
                                <ProductForm />
                            </PrivateRoute>
                        }
                    />
                        <Route
                        path="/edit-product/:id"
                        element={
                            <PrivateRoute>
                                <ProductForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <PrivateRoute>
                                <Cart />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/wishlist"
                        element={
                            <PrivateRoute>
                                <Wishlist />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/all-products"
                        element={
                            <PrivateRoute>
                                <ProductList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products/:type"
                        element={
                            <PrivateRoute>
                                <ProductsByCategoryList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/product/:id"
                        element={
                            <PrivateRoute>
                                <ProductDetail />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
