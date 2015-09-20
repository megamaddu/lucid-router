import React from 'react'
import Nav from './Nav'
import Home from './Home'
import Friends from './Friends'
import FriendInfo from './FriendInfo'
import NotFound from './NotFound'

export default class App extends React.Component {
  static viewFor(location) {
    switch (location.name) {
      case 'home':         return <Home />
      case 'friends':      return <Friends location={location} />
      case 'friends.info': return <FriendInfo location={location} />
    }
    return <NotFound />
  }

  render() {
    const {location} = this.props
    return (
      <div>
        <header>
          <Nav location={location} />
        </header>
        <section>
          {App.viewFor(location)}
        </section>
      </div>
    )
  }
}
