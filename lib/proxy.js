const fetch = require('cross-fetch');
const logger = require('./logger');

const baseProxy = url => (name, args) => {
  return fetch(`${url}/${name}`, {
    method: 'POST',
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());
};

module.exports = url => {
  const proxy = baseProxy(url);
  return stubs => {
    for (const key of Object.keys(stubs)) {
      const code = stubs[key].toString();
      const args = code.match(/\(([^)]+)\)/)[1];
      logger.debug(`Proxy ${key} is installed with (${args})`);
      stubs[key] = eval(`async (${args}) => proxy('${key}', [${args}]);`);
    }
    return stubs;
  };
};
