import React from 'react';
import { Star, Clock } from 'lucide-react';

const FoodCard = ({ food, onAddToCart }) => {
  // If not available, do not render
  if (!food.available) return null;

  return (
    <div className="relative overflow-hidden transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl group hover:shadow-xl">
      {/* Background Overlay on Hover */}
      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-green-500/10 to-transparent group-hover:opacity-100"></div>

      {/* Floating Decorative Elements on Hover */}
      <div className="absolute w-6 h-6 transition-opacity duration-500 bg-green-500 rounded-full opacity-0 top-2 left-2 group-hover:opacity-60"></div>
      <div className="absolute w-4 h-4 transition-opacity duration-500 bg-red-500 rounded-full opacity-0 bottom-2 right-2 group-hover:opacity-60"></div>

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={food.image} 
          alt={food.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
        />
        {food.isPopular && (
          <div 
            className="absolute px-2 py-1 text-xs font-semibold text-gray-900 transition-transform duration-300 bg-yellow-400 rounded-full top-3 left-3 group-hover:scale-105"
          >
            Popular
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-green-600">{food.name}</h3>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 transition-transform duration-300 fill-yellow-400 group-hover:scale-125" />
            <span className="text-sm text-gray-600">{food.rating}</span>
          </div>
        </div>
        
        <p className="mb-3 text-sm text-gray-600 transition-all duration-300 line-clamp-2 group-hover:text-gray-800 group-hover:line-clamp-none">
          {food.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock size={14} className="transition-colors duration-300 group-hover:text-green-500" />
            <span>{food.time}</span>
          </div>
          <div className="text-xl font-bold text-green-500 transition-transform duration-300 group-hover:scale-110">
            ₹{food.price}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(food)}
          className="w-full py-2 font-semibold text-white transition-all duration-300 bg-green-500 rounded-full hover:shadow-lg group-hover:scale-105 group-hover:bg-green-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;