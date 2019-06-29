/*
 * A simple express server to serve a remote procedure call
 * from a path and payload of RESTful Post API.
 *
 * A method is mapped with a path of API and arguments of method
 * are read from a payload of API request body.
 */

// There is no special reason to use `express`. It is just easy for me.
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');

/**
 * Build and run an express server to provide RESTful APIs
 * for methods as remotely callable.
 * All methods would be mapped with an Post API that a path
 * is a method name and a payload is arguments of a method.
 *
 * @param port A port number of this RPC server.
 * @param methods An object that is consisted of methods to serve.
 * @return An express app object.
 *
 * @example
 * ```javascript
 * rpc(8888, {
 *   add: (a, b) => a + b,
 * });
 * ```
 */
module.exports = (port, methods) => {
  const app = express();
  // A payload would be JSON to communicate for arguments.
  app.use(bodyParser.json());

  // Build all API handlers mapped with each of methods.
  for (const key of Object.keys(methods)) {
    const method = methods[key];

    // Add a Post API for each method has a method name as a path.
    app.post(`/${key}`, async (req, res) => {
      logger.debug(
        `method[${key}] is called with args[${JSON.stringify(req.body)}]`,
      );
      // Call an actual method with arguments from a request body.
      const result = method.apply(undefined, req.body);
      logger.debug(`Result is [${result}]`);

      // Response a result from a method call as JSON,
      // of course, if a result is Promise, it should wait the real value.
      if (result instanceof Promise) {
        res.json(await result);
      } else {
        res.json(result);
      }
    });
  }
  // After all methods are ready, it starts to listen a request.
  logger.info(`Server is on ${port} port.`);
  return app.listen(port);
};
