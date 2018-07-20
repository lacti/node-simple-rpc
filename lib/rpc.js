const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');

module.exports = (port, procedures) => {
  const app = express();
  app.use(bodyParser.json());
  for (const key of Object.keys(procedures)) {
    const procedure = procedures[key];
    app.post(`/${key}`, async (req, res) => {
      logger.debug(
        `method[${key}] is called with args[${JSON.stringify(req.body)}]`,
      );
      const result = procedure.apply(undefined, req.body);
      logger.debug(`Result is [${result}]`);
      if (result instanceof Promise) {
        res.json(await result);
      } else {
        res.json(result);
      }
    });
  }
  logger.info(`Server is on ${port} port.`);
  return app.listen(port);
};
