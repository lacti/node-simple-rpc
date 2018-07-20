const proxy = require('../../lib/proxy');
const rpcProxy = proxy('http://localhost:8192')(require('./interface'));

(async () => {
  const result = await rpcProxy.add(10, 20);
  console.log(result);
})();
