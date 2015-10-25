import React from 'react'
import Link from 'lucid-router/link'

const Nav = () =>
  <nav>
    <Link to="home">Home</Link>
    <Link to="friends">Friends</Link>
    <Link href="https://github.com/spicydonuts/lucid-router">Github</Link>
  </nav>

export default Nav
