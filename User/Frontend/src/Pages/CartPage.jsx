import React from 'react'
import {NavBar, Cart} from "../components"

export default function CartPage() {
  return (
    <div>
        <NavBar isLoggedIn={true} />
        <Cart />
      
    </div>
  )
}
