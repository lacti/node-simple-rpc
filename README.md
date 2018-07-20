# node-simple-rpc

Very simpe and minimal library and examples for nodejs RPC via HTTP and JSON in study manner.

## Concept

It is very simple to implement RPC library when a language and its library have its serializer (including serializable memory model) like JSON serializer and a simple network framework like HTTP client and server.

nodejs is very easy to implement a simple RPC library because,

- Because of `JSON.stringify` and `JSON.parse`, we don't be worried about serialization.
- Because of `express` and `fetch`, we don't be worried about how to carry them via network.

Please see details in `lib` directory.

# Library

- `lib/proxy.js` will make your interface to communicate with an actual method in `server`.
- `lib/rpc.js` will export your server procedures to communicate with a proxy method in `client`.

## Usage

### Server

```javascript
const rpc = require('./lib/rpc');
rpc(/* port-number = */ 3000, {
  add: (a, b) => a + b,
});
```

### Client

```javascript
const proxy = require('./lib/proxy')('http://localhost:3000')({
  add: (a, b) => 0,
});
proxy.add(10, 20).then(console.log);
```

## Example

See details in `example` directory.
