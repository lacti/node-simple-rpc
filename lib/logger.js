const log = (level, message) =>
  console.log(
    `[${new Date().toISOString()}][${level}] ${
      typeof message === 'string' ? message : JSON.stringify(message)
    }`,
  );

module.exports = ['error', 'warn', 'info', 'debug'].reduce(
  (all, level) =>
    Object.assign(all, { [level]: message => log(level, message), ...all }),
  {},
);
