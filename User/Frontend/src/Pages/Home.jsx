// const {MainContent, Footer, FoodCard} = require("../components") ; 
import {MainContent, Footer, FoodCard, NavBar, SignupPage, LoginPage} from "../components"
import {useEffect, useState} from 'react' ;

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sample food data
  const foods = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, and basil on crispy thin crust",
      price: 299,
      time: "15-20 min",
      rating: 4.5,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
      isPopular: true
    },
    {
      id: 2,
      name: "Chicken Biryani",
      description: "Aromatic basmati rice with tender chicken and exotic spices",
      price: 249,
      time: "25-30 min",
      rating: 4.7,
      category: "Main Course",
      image: "https://wallpaperaccess.com/full/1972917.jpg",
      isPopular: true
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with parmesan, croutons and Caesar dressing",
      price: 179,
      time: "10-15 min",
      rating: 4.2,
      category: "Starters",
      image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      price: 129,
      time: "10-12 min",
      rating: 4.8,
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Paneer Tikka",
      description: "Grilled cottage cheese marinated in aromatic Indian spices",
      price: 199,
      time: "15-18 min",
      rating: 4.4,
      category: "Starters",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice, no added sugar or preservatives",
      price: 79,
      time: "5 min",
      rating: 4.3,
      category: "Beverages",
      image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop"
    },
    {
      id: 7,
      name: "Butter Chicken",
      description: "Tender chicken in creamy tomato gravy with aromatic Indian spices",
      price: 279,
      time: "20-25 min",
      rating: 4.6,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop"
    },
    {
      id: 8,
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
      price: 149,
      time: "8-10 min",
      rating: 4.5,
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop"
    }
  ];

  const handleAddToCart = (food) => {
    setCartCount(prev => prev + 1);
    // Here you would typically add the item to a cart state or context
    console.log('Added to cart:', food.name);
  };

  const handleCall = () => {
    // Simulate making a call
    alert(`Calling Lucky's Kitchen at +91 98765 43210`);
    // In a real app, you would use: window.location.href = 'tel:+919876543210';
  };

  return (
    <div style={{backgroundColor: '#FAFAFA'}} className="min-h-screen">
      <NavBar 
        cartCount={cartCount} 
        isLoggedIn={isLoggedIn}
        onCall={handleCall}
      />
      <MainContent 
        foods={foods} 
        onAddToCart={handleAddToCart}
      />
      <Footer />
    </div>
  );
};

export default Home;