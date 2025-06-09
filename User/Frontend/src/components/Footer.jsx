import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 text-white bg-gray-900">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4 space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold">Luckey's Kitchen</span>
          </div>

          {/* Tagline */}
          <p className="text-gray-300">
            Authentic food made with love. Fast, fresh, and flavorful.
          </p>

          {/* Contact Details */}
          <div className="flex flex-wrap justify-center gap-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>Industrial City - Durgapur</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <span>+91 8170841976</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>luckeyskitchen@gmail.com</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-4 text-sm text-gray-400">
            © 2025 Luckey's Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;