import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Phone
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Navbar = ({ cartCount, isLoggedIn, onCall }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [shouldShowProfile, setShouldShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    const isValid = localStorage.getItem('isValid');

    if (email && isValid === 'true' && isLoggedIn) {
      setShouldShowProfile(true);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setShouldShowProfile(false);
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center justify-center w-8 h-8 mr-2 bg-green-500 rounded-lg">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Luckey's Kitchen
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Call Button */}
            <button
              onClick={onCall}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-all duration-300 rounded-full shadow-md hover:shadow-lg hover:bg-green-600"
              style={{ backgroundColor: '#28C76F' }}
            >
              <Phone size={18} />
              <span className="hidden sm:inline">Call Restaurant</span>
            </button>

            {/* Cart */}
            <div className="relative">
              <button
                className="p-2 transition-colors rounded-full hover:bg-gray-50"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart size={20} className="text-gray-600" />
                {cartCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Actions */}
            {isLoggedIn && shouldShowProfile ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center p-2 transition-colors rounded-full hover:bg-gray-50"
                >
                  <User size={20} className="text-gray-600" />
                </button>
                {showProfile && (
                  <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg">
                    <button
                      className="flex items-center w-full px-4 py-2 space-x-2 text-left text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => navigate('/profile')}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 space-x-2 text-left text-red-600 transition-colors hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  className="flex items-center px-4 py-2 space-x-2 text-gray-600 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-md"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </button>
                <button
                  className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-all duration-300 rounded-full shadow-md hover:shadow-lg hover:bg-red-600"
                  style={{ backgroundColor: '#FF4C29' }}
                  onClick={() => navigate('/auth')}
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;