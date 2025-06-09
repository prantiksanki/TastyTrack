import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#333333' }} className="py-8 text-white">
      <div className="max-w-4xl px-4 mx-auto space-y-4 text-center">
        <h3 className="text-2xl font-bold">
          Luckey's <span style={{ color: '#FF4C29' }}>Kitchen</span>
        </h3>
        <p className="text-gray-300">
          Authentic food made with love. Fast, fresh, and flavorful.
        </p>
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
        <p className="mt-4 text-sm text-gray-400">
          &copy; 2025 Lucky's Kitchen. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
