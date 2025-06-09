import { MainContent, Footer, NavBar } from "../components";
import { useEffect, useState } from 'react';

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [foods, setFoods] = useState([]);

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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <NavBar
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        onCall={handleCall}
      />

      {/* Main content takes available space */}
      <main className="flex-grow">
        <MainContent
          foods={foods}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Footer sticks to bottom if not enough content */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
