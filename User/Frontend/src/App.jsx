import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from "./Pages/Home" ; 
import Auth from "./Pages/Auth" ; 
import CartPage from "./Pages/CartPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element = {<CartPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
