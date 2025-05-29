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


const FoodCard = ({ food, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={food.image} 
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {food.isPopular && (
          <div 
            className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white"
            style={{backgroundColor: '#FFD93D', color: '#333333'}}
          >
            Popular
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
          <div className="flex items-center space-x-1">
            <Star size={16} style={{color: '#FFD93D'}} fill="#FFD93D" />
            <span className="text-sm text-gray-600">{food.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Clock size={14} />
            <span>{food.time}</span>
          </div>
          <div className="text-xl font-bold" style={{color: '#FF4C29'}}>
            ₹{food.price}
          </div>
        </div>
        
        <button
          onClick={() => onAddToCart(food)}
          className="w-full py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:shadow-lg"
          style={{backgroundColor: '#FF4C29'}}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};


export default FoodCard;
