/*
 * A proxy layer to connect the opposite, that is a RPC server.
 *
 * It would generate a proxy object that intercepts a method call,
 * capture a function name and arguments and send it to a RPC server.
 *
 * It communicates with a RPC server using a simple RESTful API with JSON.
 *   - A method name will be a path of API.
 *   - Arguments of method call will be a payload of API.
 *
 * If you are friend with `curl`, it is more easy for you.
 *
 * ```bash
 * curl -XPOST "rpc-server/method-name" \
 *   -H "content-type: application/json" \
 *   -d '{ arguments }'
 * ```
 */

// There are lots of libraries to fetch but I like this without special reason.
const fetch = require('cross-fetch');
const logger = require('./logger');

/**
 * Generate a basic proxy object for method call with a server URL.
 *
 * @params url An endpoint URL of a RPC server.
 * @return A method proxy that sends its context to a RPC server.
 */
const baseProxy = url => (name, args) => {
  // Make a POST call mapped with a method name with stringified arguments.
  // It is predefined we will communicate with JSON between a client and a server.
  return fetch(`${url}/${name}`, {
    method: 'POST',
    body: JSON.stringify(args),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());
};

/**
 * Make a call proxy object that would be communicated with a RPC server.
 * When you call a method in this stub object, 
 *   - it captures this call context,
 *   - sends it to a RPC server using JSON, 
 *   - reads its result as JSON,
 *   - returns a result object as Promise object. 
 *
 * A proxy object that is created by `baseProxy` method executes above processes,
 * and this method binds all of methods in a stub object with that proxy object
 * preserving the same signature.
 * But JavaScript doesn't have `MethodInterceptor` like Java but there is
 * more powerful method `eval` that can generates this bindings.
 *
 * @params url An endpoint URL of a RPC server.
 * @return A proxy object that intercepts a method call to send it to a server
 *         and retrieves a result of that call from a server.
 * @example
 * ```
 *   proxy(`server-url`)({
 *     add: (a, b) => {
 *       // It should not have an actual implementation
 *       // because it will be overwritten by a proxy code. 
 *     }
 *   }).add(10, 20).then(console.log);
 * ```
 */
module.exports = url => {
  const proxy = baseProxy(url);

  /**
   * Overwrite all methods in a stub object with a new method to request
   * call context to a RPC server, so `stub` object doesn't have an actual method
   * implementation.
   *
   * A `stub` method doesn't have its actual implementation and only have
   * its signature information such as a method name and a list of arguments.
   * Other languages like Java uses an interface for this but JavaScript can't do.
   *
   * There is no type and can't read a type information in Runtime. Actually,
   * JavaScript doesn't need have to be. It is a script language and it can create
   * and evaluate a code in Runtime. So we can easily intercept a method call with
   * a newly created method code using the same interface that is extracted from
   * the original code.
   *
   * @param stubs A `stub` object that is consisted of all `stub` methods.
   */
  return stubs => {
    for (const key of Object.keys(stubs)) {
      // A type of `stub` object is `{ [name: string]: Function }`.
      // So we can get a function code using a result of `Function.toString()`.
      const code = stubs[key].toString();

      // And can get a signature parsing a code with regular expression.
      const args = code.match(/\(([^)]+)\)/)[1];

      logger.debug(`Proxy ${key} is installed with (${args})`);

      // Generate a method to bind with a proxy method
      // to send a request of method call to a RPC server,
      // and overwrite the original method to preserve the same interface.
      stubs[key] = eval(`async (${args}) => proxy('${key}', [${args}]);`);
    }
    return stubs;
  };
};
