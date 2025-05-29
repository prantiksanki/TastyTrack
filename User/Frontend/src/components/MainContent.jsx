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
import FoodCard from './FoodCard';


const MainContent = ({ foods, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

  const filteredFoods = selectedCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Delicious Food, <span style={{color: '#FF4C29'}}>Delivered Fresh</span>
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Experience authentic flavors from Luckey's Kitchen, delivered right to your doorstep
        </p>
        <div className="flex items-center justify-center space-x-6 text-gray-600">
          <div className="flex items-center space-x-2">
            <Truck size={20} style={{color: '#28C76F'}} />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={20} style={{color: '#FFD93D'}} />
            <span>30 min delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star size={20} style={{color: '#FFD93D'}} />
            <span>4.8 rating</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'text-white shadow-lg'
                : 'text-gray-600 bg-white hover:bg-gray-50'
            }`}
            style={{
              backgroundColor: selectedCategory === category ? '#FF4C29' : undefined
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFoods.map(food => (
          <FoodCard 
            key={food.id} 
            food={food} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </main>
  );
};

export default MainContent;
