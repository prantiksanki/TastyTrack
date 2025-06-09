import React, { useState, useEffect } from 'react';
import { User, MapPin, Clock, CreditCard, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSection = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL || 'https://tastytrack-user-backend.onrender.com';

  // Fetch user data
  useEffect(() => {
    const email = localStorage.getItem("email");
    console.log("Email from localStorage:", email);

    if (!email) {
      console.warn("No email found in localStorage");
      setError("Please log in to view your profile.");
      setLoading(false);
      navigate('/login');
      return;
    }

    setLoading(true);
    fetch(`${baseURL}/user/${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched user data:", data);
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
        setLoading(false);
      });
  }, [navigate]);

  // Fetch order history
  useEffect(() => {
    const email = localStorage.getItem("email");
    console.log("Email from localStorage:", email);

    if (!email) {
      console.warn("No email found in localStorage");
      setError("Please log in to view your profile.");
      setLoading(false);
      navigate('/login');
      return;
    }

    setLoading(true);
    fetch(`${baseURL}/orders/${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched order data:", data);
        setOrderHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order data:", err);
        setError("Failed to load order history. Please try again.");
        setLoading(false);
      });
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'preparing':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <p className="text-gray-900">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute w-16 h-16 top-10 left-10 opacity-20">
          <div className="w-full h-1 transform rotate-45 bg-green-500 rounded"></div>
          <div className="w-full h-1 -mt-1 transform -rotate-45 bg-green-500 rounded"></div>
        </div>
        <div className="absolute w-12 h-12 bg-red-400 rounded-full top-20 right-20 opacity-20"></div>
        <div className="absolute w-8 h-8 bg-green-500 rounded-full bottom-20 left-1/4 opacity-30"></div>
        <div className="absolute w-6 h-6 bg-red-500 rounded-full bottom-32 right-1/3 opacity-40"></div>

        {/* Floating vegetables */}
        <div className="absolute w-16 h-16 top-1/4 right-10 opacity-60">
          🍅
        </div>
        <div className="absolute w-12 h-12 bottom-1/4 right-20 opacity-60">
          🍅
        </div>
        <div className="absolute opacity-50 top-1/3 left-1/4 w-14 h-14">
          🥬
        </div>
        <div className="absolute w-12 h-12 opacity-50 bottom-20 right-10">
          🥬
        </div>

        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Information Card */}
            <div className="lg:col-span-1">
              <div className="p-6 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
                    <User className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">{userData?.name || 'N/A'}</h2>
                    <p className="text-gray-600">
                      Customer since {userData?.createdAt 
                        ? new Date(userData.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) 
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                      <User className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{userData?.name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{userData?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{userData?.phoneNo || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="flex items-center text-xl font-semibold text-gray-900">
                    <Package className="w-5 h-5 mr-2 text-green-500" />
                    Order History
                  </h2>
                  <p className="mt-1 text-gray-600">Track your past orders and reorder your favorites</p>
                </div>

                <div className="divide-y divide-gray-200">
                  {orderHistory.map((order) => (
                    <div key={order._id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Order #{order._id}</p>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">₹{order.total}</p>
                          <p className="text-sm text-gray-500 capitalize">{order.paymentMethod}</p>
                        </div>
                      </div>

                      <div className="flex items-center mb-4 space-x-4">
                        <div className="flex -space-x-2">
                          {Array.isArray(order.cartItems) && order.cartItems.length > 0 ? (
                            order.cartItems.slice(0, 3).map((item, index) => (
                              <img
                                key={index}
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-12 h-12 border-2 border-white rounded-lg"
                              />
                            ))
                          ) : null}
                          {Array.isArray(order.cartItems) && order.cartItems.length > 3 && (
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 border-2 border-white rounded-lg">
                              <span className="text-xs text-gray-600">+{order.cartItems.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {Array.isArray(order.cartItems) ? order.cartItems.length : 0} item
                            {Array.isArray(order.cartItems) && order.cartItems.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {Array.isArray(order.cartItems) && order.cartItems.length > 0 ? order.cartItems[0].name : 'No items'}
                            {Array.isArray(order.cartItems) && order.cartItems.length > 1 && `, +${order.cartItems.length - 1} more`}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="flex items-center text-sm font-medium text-green-500 hover:text-green-600"
                      >
                        {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                        {expandedOrder === order._id ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>

                      {expandedOrder === order._id && (
                        <div className="pt-4 mt-4 border-t border-gray-100">
                          <div className="mb-4">
                            <h4 className="mb-2 text-sm font-medium text-gray-900">Items Ordered</h4>
                            <div className="space-y-3">
                              {Array.isArray(order.cartItems) && order.cartItems.map((item) => (
                                <div key={item._id} className="flex items-center space-x-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-cover w-16 h-16 rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                  </div>
                                  <p className="font-medium text-gray-900">₹{item.quantity * item.price}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="flex items-center mb-2 text-sm font-medium text-gray-900">
                              <MapPin className="w-4 h-4 mr-1 text-green-500" />
                              Delivery Address
                            </h4>
                            <div className="p-3 rounded-lg bg-gray-50">
                              <p className="font-medium text-gray-900">{order.selectedAddress.title}</p>
                              <p className="text-sm text-gray-600">
                                {order.selectedAddress.address}, {order.selectedAddress.city} - {order.selectedAddress.pincode}
                              </p>
                              {order.selectedAddress.landmark && (
                                <p className="text-sm text-gray-500">Landmark: {order.selectedAddress.landmark}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="flex items-center mb-2 text-sm font-medium text-gray-900">
                                <CreditCard className="w-4 h-4 mr-1 text-green-500" />
                                Payment Method
                              </h4>
                              <p className="text-sm text-gray-600 capitalize">{order.paymentMethod.toUpperCase()}</p>
                              <p className="text-sm text-gray-500">
                                Status: {order.isPaid ? 'Paid' : 'Pending'}
                              </p>
                            </div>

                            {(order.promoCode || order.orderNote) && (
                              <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-900">Additional Details</h4>
                                {order.promoCode && (
                                  <p className="text-sm text-gray-600">Promo Code: {order.promoCode}</p>
                                )}
                                {order.orderNote && (
                                  <p className="text-sm text-gray-600">Note: {order.orderNote}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {orderHistory.length === 0 && (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mb-4 text-sm text-gray-600">Start exploring our delicious menu!</p>
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-2 font-semibold text-white transition-all bg-green-500 rounded-full shadow-md hover:shadow-lg hover:scale-105"
                    >
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;