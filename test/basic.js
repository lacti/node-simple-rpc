const assert = require('assert');

describe('basic', () => {
  it('simple adder', async () => {
    // Server
    const rpc = require('../lib/rpc');
    const handle = rpc(3000 /* port-number */, {
      add: (a, b) => a + b,
    });

    // Client
    const proxy = require('../lib/proxy')('http://localhost:3000')({
      add: (a, b) => 0,
    });
    const result = await proxy.add(10, 20);
    assert.equal(result, 30);
    handle.close();
  });
});
