import React from 'react';
import { 
  Star,
  Clock
} from 'lucide-react';

const FoodCard = ({ food, onAddToCart }) => {
  // If not available, do not render
  if (!food.available) return null;

  return (
    <div className="overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={food.image} 
          alt={food.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {food.isPopular && (
          <div 
            className="absolute px-2 py-1 text-xs font-semibold text-white rounded-full top-3 left-3"
            style={{backgroundColor: '#FFD93D', color: '#333333'}}
          >
            Popular
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
          <div className="flex items-center space-x-1">
            <Star size={16} style={{color: '#FFD93D'}} fill="#FFD93D" />
            <span className="text-sm text-gray-600">{food.rating}</span>
          </div>
        </div>
        
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{food.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock size={14} />
            <span>{food.time}</span>
          </div>
          <div className="text-xl font-bold" style={{color: '#FF4C29'}}>
            ₹{food.price}
          </div>
        </div>
        
        <button
          onClick={() => onAddToCart(food)}
          className="w-full py-2 font-semibold text-white transition-all duration-300 rounded-lg hover:shadow-lg"
          style={{backgroundColor: '#FF4C29'}}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
