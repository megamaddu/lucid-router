import React from 'react'
import * as router from 'lucid-router'
import App from './components/App'

router.addRoutes([
  {name: 'home',         path: '/'},
  {name: 'friends',      path: '/friends'},
  {name: 'friends.info', path: '/friends/:name'}
])

router.register(location => render(location))

render(router.getLocation())

function render(location) {
  React.render(<App location={location} />, document.body)
}
