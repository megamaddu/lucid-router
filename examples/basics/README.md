# lucid-router basic example
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

All the configuration bits are in the [app.js](https://github.com/spicydonuts/lucid-router/blob/master/examples/basics/app.js) file.
All navigation is in [index.html](https://github.com/spicydonuts/lucid-router/blob/master/examples/basics/index.html).

Notice the link to Github is not in the routing table, so a normal redirect is performed.
Also notice when you're on one of the specific friend routes (like /friends/alice) that the `:name` key in the route overrides the `name` query param.

Congratulations, you've taken your first step into abstracting the concept of routing into a simple stream of data!
