import { MainContent, Footer, FoodCard, NavBar } from "../components";
import { useEffect, useState } from 'react';

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [foods, setFoods] = useState([]);

  // ✅ Use environment variable (VITE_BASE_URL)
  const baseURL = import.meta.env.VITE_BASE_URL || 'https://tastytrack-user-backend.onrender.com';

  useEffect(() => {
    const email = localStorage.getItem('email');
    const isValid = localStorage.getItem('isValid');

    if (email && JSON.parse(isValid) === true) {
      setIsLoggedIn(true);
    }

    // Fetch menu items
    setTimeout(() => {
      fetch(`${baseURL}/menu`)
        .then(response => response.json())
        .then(data => {
          console.log("Fetched foods:", data);
          setFoods(data);
        })
        .catch(err => {
          console.error("Error fetching food data:", err);
        });
    }, 1000);
  }, [baseURL]);

  const handleAddToCart = (food) => {
    setCartCount(prev => prev + 1);
    console.log('Added to cart:', food);

    fetch(`${baseURL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: food.name,
        description: food.description,
        price: food.price,
        image: food.image,
        customizations: food.customizations,
        user: localStorage.getItem("email")
      })
    });
  };

  const handleCall = () => {
    alert(`Calling Lucky's Kitchen at +91 98765 43210`);
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA' }} className="min-h-screen">
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
