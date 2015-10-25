import React from 'react'
import Nav from './Nav'
import Home from './Home'
import Friends from './Friends'
import FriendInfo from './FriendInfo'
import NotFound from './NotFound'

const viewFor = location => {
  switch (location.name) {
    case 'home':         return <Home />
    case 'friends':      return <Friends location={location} />
    case 'friends.info': return <FriendInfo location={location} />
  }
  return <NotFound />
}

const App = ({location}) =>
  <div>
    <header>
      <Nav location={location} />
    </header>
    <section>
      {viewFor(location)}
    </section>
  </div>

export default App
