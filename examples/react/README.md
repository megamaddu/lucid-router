# lucid-router react example
This example uses `jspm` and `express`, which `npm` will grab for you:
```sh
npm install
```
Then run express with:
```sh
npm start
```
Then head to `localhost:3000`.
You could also just use `serve` or something instead of `express`, but then you'd get a 404 if you navigated to `/friends` and then refreshed.
: ]

All the configuration bits are in the [app.js](https://github.com/spicydonuts/lucid-router/blob/master/examples/react/app.js) file.
The React components are in [/components](https://github.com/spicydonuts/lucid-router/tree/master/examples/react/components).

React makes it easy to render any route when a route is just state, because rendering changing state over time is what React is great at!
