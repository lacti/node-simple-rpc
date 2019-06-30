const proxy = require('../../lib/proxy');

/*
 * 1. Load an object of stub methods that have only the signature.
 * 2. Build a proxy object from stub methods to send its context
 *    to a RPC server and retrieve its result.
 *
 * Simply speaking, we create a RPC client from the interface.
 */
const rpcProxy = proxy('http://localhost:8192')(require('./interface'));

(async () => {
  // Using a RPC client, make a call of `add` function with arguments.
  // It makes a HTTP Post call to "/add" API with `{a: 10, b: 20}` body
  // and returns its result from the server as a promise object.
  const result = await rpcProxy.add(10, 20);
  console.log(result);
})();
