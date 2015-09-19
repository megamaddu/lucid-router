import * as router from 'lucid-router'

//-- let the links in nav call `navigate` --//
window.navigate = router.navigate

router.addRoutes([
  {name: 'home',         path: '/'},
  {name: 'friends',      path: '/friends'},
  {name: 'friends.info', path: '/friends/:name'}
])

router.register(location => render(location))

render(router.getLocation())

function render(location) {
  const pre = document.querySelector('pre')
  pre.innerHTML = JSON.stringify(location, null, 2)
}
