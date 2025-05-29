import React, { useState } from 'react';
import { 
  ShoppingCart, 
  User, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Phone,
  Star,
  Clock,
  Truck,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Mail
} from 'lucide-react';



const Navbar = ({ cartCount, isLoggedIn, onCall }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Luckey's <span style={{color: '#FF4C29'}}>Kitchen</span>
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Call Button */}
            <button
              onClick={onCall}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{backgroundColor: '#28C76F', color: 'white'}}
            >
              <Phone size={18} />
              <span className="hidden sm:inline">Call Restaurant</span>
            </button>

            {/* Cart */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingCart size={24} style={{color: '#FF4C29'}} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 text-xs rounded-full h-6 w-6 flex items-center justify-center text-white font-semibold"
                    style={{backgroundColor: '#FF4C29'}}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Actions */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User size={20} style={{color: '#333333'}} />
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors">
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </button>
                <button 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg"
                  style={{backgroundColor: '#FF4C29'}}
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