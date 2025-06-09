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
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-gray-800">
              Luckey's <span style={{ color: '#FF4C29' }}>Kitchen</span>
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Call Button */}
            <button
              onClick={onCall}
              className="flex items-center px-4 py-2 space-x-2 transition-all duration-300 rounded-lg hover:shadow-lg"
              style={{ backgroundColor: '#28C76F', color: 'white' }}
            >
              <Phone size={18} />
              <span className="hidden sm:inline">Call Restaurant</span>
            </button>

            {/* Cart */}
            <div className="relative">
              <button className="p-2 transition-colors rounded-full hover:bg-gray-100"
                onClick={() => navigate('/cart')}>
                <ShoppingCart size={24} style={{ color: '#FF4C29' }} />
                {cartCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center w-6 h-6 text-xs font-semibold text-white rounded-full -top-2 -right-2"
                    style={{ backgroundColor: '#FF4C29' }}
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
                  className="flex items-center p-2 space-x-2 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <User size={20} style={{ color: '#333333' }} />
                </button>
                {showProfile && (
                  <div className="absolute right-0 w-48 mt-2 bg-white border rounded-lg shadow-lg">
                    <button
                      className="flex items-center w-full px-4 py-2 space-x-2 text-left hover:bg-gray-50"
                      onClick={() => navigate('/profile')}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 space-x-2 text-left text-red-600 hover:bg-gray-50"
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
                  className="flex items-center px-4 py-2 space-x-2 transition-colors border rounded-lg hover:bg-gray-50"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </button>
                <button
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-all duration-300 rounded-lg hover:shadow-lg"
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
