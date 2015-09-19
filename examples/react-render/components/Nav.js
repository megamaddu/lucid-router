import React from 'react'
import Link from 'lucid-router/link'

export default class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to="home">Home</Link>
        <Link to="friends">Friends</Link>
        <Link href="https://github.com/spicydonuts/lucid-router">Github</Link>
      </nav>
    )
  }
}
