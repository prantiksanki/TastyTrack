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
  Mail,
  Search,
  ArrowRight
} from 'lucide-react';
import Lottie from 'lottie-react';
import emptyAnimation from '../assets/Empty.json'; // Ensure this path is correct

const MainContent = ({ foods, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

  const filteredFoods = selectedCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  // FoodCard component (copied from the second code for consistency)
  const FoodCard = ({ food }) => {
    if (!food.available) return null;

    return (
      <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={food.image} 
            alt={food.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {food.isPopular && (
            <div className="absolute px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full top-3 left-3">
              Popular
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{food.rating || '4.5'}</span>
            </div>
          </div>
          
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{food.description || 'Delicious item'}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock size={14} />
              <span>{food.time || '20 min'}</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              ₹{food.price}
            </div>
          </div>
          
          <button
            onClick={() => onAddToCart(food)}
            className="w-full py-2 font-semibold text-white transition-colors duration-300 bg-green-500 rounded-lg hover:bg-green-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
      {/* Header */}
      {/* <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16"> */}
            {/* Logo */}
            {/* <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">Luckey's Kitchen</span>
            </div> */}

            {/* Navigation */}
            {/* <nav className="hidden space-x-8 md:flex">
              <a href="#" className="font-medium text-gray-900 transition-colors hover:text-green-600">Home</a>
              <a href="#" className="text-gray-600 transition-colors hover:text-green-600">Menu</a>
              <a href="#" className="text-gray-600 transition-colors hover:text-green-600">Service</a>
              <a href="#" className="text-gray-600 transition-colors hover:text-green-600">Shop</a>
            </nav> */}

            {/* Search and Cart */}
            {/* <div className="flex items-center space-x-4">
              <div className="items-center hidden px-4 py-2 bg-white border rounded-full shadow-sm sm:flex">
                <Search size={18} className="mr-2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-32 text-sm bg-transparent outline-none lg:w-48"
                />
              </div>
              <div className="relative">
                <ShoppingCart size={20} className="text-gray-600" />
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute w-16 h-16 top-10 left-10 opacity-20">
          <div className="w-full h-1 transform rotate-45 bg-green-500 rounded"></div>
          <div className="w-full h-1 -mt-1 transform -rotate-45 bg-green-500 rounded"></div>
        </div>
        
        <div className="absolute w-12 h-12 bg-red-400 rounded-full top-20 right-20 opacity-20"></div>
        <div className="absolute w-8 h-8 bg-green-500 rounded-full bottom-20 left-1/4 opacity-30"></div>
        <div className="absolute w-6 h-6 bg-red-500 rounded-full bottom-32 right-1/3 opacity-40"></div>

        {/* Floating vegetables */}
        <div className="absolute w-16 h-16 top-1/4 right-10 opacity-60">
          🍅
        </div>
        <div className="absolute w-12 h-12 bottom-1/4 right-20 opacity-60">
          🍅
        </div>
        <div className="absolute opacity-50 top-1/3 left-1/4 w-14 h-14">
          🥬
        </div>
        <div className="absolute w-12 h-12 opacity-50 bottom-20 right-10">
          🥬
        </div>

        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
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
                <button className="px-8 py-4 font-semibold text-white transition-colors duration-300 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl">
                  Make an order
                </button>

                <div className="flex items-center space-x-2 text-gray-700 transition-colors cursor-pointer hover:text-green-600">
                  <span className="font-medium">Specials for lunch</span>
                  <ArrowRight size={20} className="text-green-500" />
                </div>
              </div>
            </div>

            {/* Right Content - Food Image */}
            <div className="relative">
              <div className="relative max-w-md p-8 mx-auto bg-white rounded-full shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop" 
                  alt="Healthy Food Bowl"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              
              {/* Floating leaves */}
              <div className="absolute w-12 h-12 -top-4 -right-4 opacity-70">
                🥬
              </div>
              <div className="absolute w-10 h-10 -bottom-4 -left-4 opacity-60">
                🥬
              </div>
              <div className="absolute w-8 h-8 opacity-50 top-1/2 -right-8">
                🥬
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories and Food Grid */}
      <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Grid or Empty State */}
        {filteredFoods.filter(food => food.available).length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-64 mx-auto sm:w-72">
              <Lottie animationData={emptyAnimation} loop autoplay />
            </div>
            <p className="text-lg text-gray-500">No food items available in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        )}
      </section>

      {/* Footer */}
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