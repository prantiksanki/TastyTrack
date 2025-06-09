import React from 'react'
import {NavBar, Profile} from "../components"

export default function ProfilePage() {
  return (
    <div>
      <NavBar isLoggedIn={true} />
      <Profile />
    </div>
  )
}
