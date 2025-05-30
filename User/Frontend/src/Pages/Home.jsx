import { MainContent, Footer, FoodCard, NavBar } from "../components";
import { useEffect, useState } from 'react';

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [foods, setFoods] = useState([]); // <-- Manage food items in state

  useEffect(() => {
    const email = localStorage.getItem('email');
    const isValid = localStorage.getItem('isValid');

    console.log("email:", email, "isValid:", isValid);

    if (email && JSON.parse(isValid) === true) {
      setIsLoggedIn(true);
    }

    // Fetch menu items
    fetch("http://localhost:80/menu")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched foods:", data);
        setFoods(data); // <-- Set fetched data to state
      })
      .catch(err => {
        console.error("Error fetching food data:", err);
      });

  }, []);

  const handleAddToCart = (food) => {
    setCartCount(prev => prev + 1);
    console.log('Added to cart:', food.name);
  };

  const handleCall = () => {
    alert(`Calling Lucky's Kitchen at +91 98765 43210`);
    // window.location.href = 'tel:+919876543210';
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
