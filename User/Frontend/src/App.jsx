import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from "./Pages/Home" ; 
import Auth from "./Pages/Auth" ; 
import CartPage from "./Pages/CartPage"
import ProfilePage from "./Pages/ProfilePage"
import { Profile } from './components';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element = {<CartPage/>}/>
        <Route path="/profile" element = {<ProfilePage/>}/>

      </Routes>
    </Router>
  );
}

export default App;
