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




const Footer = () => {
  return (
    <footer style={{backgroundColor: '#333333'}} className="text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Luckey's <span style={{color: '#FF4C29'}}>Kitchen</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Authentic cuisine crafted with love and delivered with care. Experience the taste of tradition.
            </p>
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin size={16} />
              <span>123 Food Street, Taste City</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Menu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-2 text-gray-300 mb-4">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>Luckeyskitchen@gmail.com</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Facebook size={20} className="hover:text-blue-400 transition-colors cursor-pointer" />
              <Instagram size={20} className="hover:text-pink-400 transition-colors cursor-pointer" />
              <Twitter size={20} className="hover:text-blue-300 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Lucky's Kitchen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};


export default Footer; 