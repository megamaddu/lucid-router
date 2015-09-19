# lucid-router basic example

This example uses `jspm` and is easy to run with `serve`:
```sh
npm install -g jspm serve
```
Next install the example's dependencies:
```sh
jspm install
```
Then head to `localhost:3000`.

Notice the link to Github is not in the routing table, so a normal redirect is performed.
Also notice when you're on one of the specific friend routes (like /friends/alice) that the `:name` key in the route overrides the `name` query param.

Congratulations, you've taken your first step into abstracting the concept of routing into a simple stream of data!
