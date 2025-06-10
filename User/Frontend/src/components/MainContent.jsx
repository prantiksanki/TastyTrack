import React, { useState, useRef } from 'react';
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
  Mail,
  Search,
  ArrowRight
} from 'lucide-react';
import Lottie from 'lottie-react';
import emptyAnimation from '../assets/Empty.json'; // Ensure this path is correct4
import LoadingAnimation from '../assets/loading.json'
import { useNavigate } from "react-router-dom"; 

const MainContent = ({ foods, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];
  const navigate = useNavigate();
  const foodGridRef = useRef(null)

  // Determine if loading (foods is undefined or empty)
  const isLoading = !foods || foods.length === 0;

  const filteredFoods = selectedCategory === 'All' 
    ? foods || [] 
    : (foods || []).filter(food => food.category === selectedCategory);

  // FoodCard component (unchanged)
  const FoodCard = ({ food }) => {
    if (!food.available) return null;

    return (
      <div className="relative overflow-hidden transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl group hover:shadow-xl">
        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-green-500/10 to-transparent group-hover:opacity-100"></div>
        <div className="absolute w-6 h-6 transition-opacity duration-500 bg-green-500 rounded-full opacity-0 top-2 left-2 group-hover:opacity-60"></div>
        <div className="absolute w-4 h-4 transition-opacity duration-500 bg-red-500 rounded-full opacity-0 bottom-2 right-2 group-hover:opacity-60"></div>
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
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-green-600">{food.name}</h3>
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-yellow-400 transition-transform duration-300 fill-yellow-400 group-hover:scale-125" />
              <span className="text-sm text-gray-600">{food.rating || '4.5'}</span>
            </div>
          </div>
          <p className="mb-3 text-sm text-gray-600 transition-all duration-300 line-clamp-2 group-hover:text-gray-800 group-hover:line-clamp-none">
            {food.description || 'Delicious item'}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock size={14} className="transition-colors duration-300 group-hover:text-green-500" />
              <span>{food.time || '20 min'}</span>
            </div>
            <div className="text-xl font-bold text-green-500 transition-transform duration-300 group-hover:scale-110">
              ₹{food.price}
            </div>
          </div>
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

  const scrollToFoodGrid = () => {
    if (foodGridRef.current) {
      foodGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
      {/* Hero Section (unchanged) */}
      <section className="relative overflow-hidden">
        <div className="absolute w-16 h-16 top-10 left-10 opacity-20">
          <div className="w-full h-1 transform rotate-45 bg-green-500 rounded"></div>
          <div className="w-full h-1 -mt-1 transform -rotate-45 bg-green-500 rounded"></div>
        </div>
        <div className="absolute w-12 h-12 bg-red-400 rounded-full top-20 right-20 opacity-20"></div>
        <div className="absolute w-8 h-8 bg-green-500 rounded-full bottom-20 left-1/4 opacity-30"></div>
        <div className="absolute w-6 h-6 bg-red-500 rounded-full bottom-32 right-1/3 opacity-40"></div>
        <div className="absolute w-16 h-16 top-1/4 right-10 opacity-60">🍅</div>
        <div className="absolute w-12 h-12 bottom-1/4 right-20 opacity-60">🍅</div>
        <div className="absolute opacity-50 top-1/3 left-1/4 w-14 h-14">🥬</div>
        <div className="absolute w-12 h-12 opacity-50 bottom-20 right-10">🥬</div>
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-medium">Quick delivery 🏃‍♂️</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-6xl">
                Delicious Food,<br />
                Delivered Fresh.
              </h1>
              <p className="max-w-md text-lg text-gray-600">
                Experience authentic flavors from Luckey's Kitchen, delivered right to your doorstep.
              </p>
              <div className="space-y-4">
                <button 
                  className="px-8 py-4 font-semibold text-white transition-colors duration-300 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl"
                  onClick={() => navigate('/cart')}
                >
                  Make an order
                </button>
                <div 
                  className="flex items-center space-x-2 text-gray-700 transition-colors cursor-pointer hover:text-green-600"
                  onClick={scrollToFoodGrid}
                >
                  <span className="font-medium">Specials for lunch</span>
                  <ArrowRight size={20} className="text-green-500" />
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative max-w-md p-8 mx-auto bg-white rounded-full shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop" 
                  alt="Healthy Food Bowl"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div className="absolute w-12 h-12 -top-4 -right-4 opacity-70">🥬</div>
              <div className="absolute w-10 h-10 -bottom-4 -left-4 opacity-60">🥬</div>
              <div className="absolute w-8 h-8 opacity-50 top-1/2 -right-8">🥬</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories and Food Grid */}
      <section 
        ref={foodGridRef}
        className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md'
              }`}
              disabled={isLoading} // Disable buttons while loading
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading Spinner or Food Grid/Empty State */}
       {
  isLoading ? (
    <div className="py-8 text-center">
      <div className="w-32 mx-auto sm:w-40 md:w-48">
        <Lottie animationData={LoadingAnimation} loop autoplay />
      </div>
      <p className="mt-2 text-base text-gray-600 sm:text-lg">Loading menu items...</p>
    </div>
  ) : filteredFoods.filter(food => food.available).length === 0 ? (
    <div className="py-8 text-center">
      <div className="w-32 mx-auto sm:w-40 md:w-48">
        <Lottie animationData={emptyAnimation} loop autoplay />
      </div>
      <p className="mt-2 text-base text-gray-600 sm:text-lg">No food items available in this category right now.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredFoods
        .filter(food => food.available)
        .map(food => (
          <FoodCard
            key={food._id || food.id}
            food={food}
            onAddToCart={onAddToCart}
          />
        ))}
    </div>
  )
}
      </section>

      {/* Footer (unchanged) */}
      <footer className="mt-20 text-white bg-gray-900">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold">Luckey's Kitchen</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainContent;