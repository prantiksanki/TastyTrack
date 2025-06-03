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
    setTimeout(() => {
    fetch("http://localhost:80/menu")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched foods:", data);
        setFoods(data); // <-- Set fetched data to state
      })
      .catch(err => {
        console.error("Error fetching food data:", err);
      });
    } , 1000)

  }, []);

  const handleAddToCart = (food) => {
    setCartCount(prev => prev + 1);
    const foods = food; 
    console.log('Added to cart:', foods);
    // id: 1,
    //         name: 'Butter Chicken',
    //         description: 'Creamy tomato-based curry with tender chicken',
    //         price: 320,
    //         quantity: 2,
    //         image: '🍛',
    //         customizations: ['Extra Spicy', 'No Onions']

   fetch("http://localhost:80/cart", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: foods.name,
              description : foods.description,
              price : foods.price,
              image : foods.image,
              customizations : foods.customizations,
              user: localStorage.getItem("email")
            })
});

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
