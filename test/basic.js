const assert = require('assert');

describe('basic', () => {
  it('simple adder', async () => {
    // Run a RPC server with `add` method.
    // It will be called from below RPC client.
    const rpc = require('../lib/rpc');
    const handle = rpc(3000 /* port-number */, {
      add: (a, b) => a + b,
    });

    // Build a RPC client for `add` method.
    const proxy = require('../lib/proxy')('http://localhost:3000')({
      add: (a, b) => 0,
    });
    // Call `add` method via remote procedure call and wait the result.
    const result = await proxy.add(10, 20);

    // The result of 10 + 20 should be 30 and it is true if a RPC is success.
    assert.equal(result, 30);

    // Shutdown a RPC server because all is done.
    handle.close();
  });
});
