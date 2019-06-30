/*
 * Just a thin logger.
 *
 * There is no something special for this logger.
 * It only provides the abstraction logging layer of `console.log`
 * with ISO date prefix and `stringify` for object values.
 */

/**
 * Write a log message with ISO formatted date via `console.log`.
 *
 * @params level 'error' | 'warn' | 'info' | 'debug'
 * @params message A text or an object to print out.
 */
const log = (level, message) =>
  console.log(
    `[${new Date().toISOString()}][${level}] ${
      typeof message === 'string' ? message : JSON.stringify(message)
    }`,
  );

/*
 * Export all logs functions with each log levels.
 * But there is no severity for this ;)
 */
module.exports = ['error', 'warn', 'info', 'debug'].reduce(
  (all, level) =>
    Object.assign(all, { [level]: message => log(level, message) }),
  {},
);

/*
 * Of course, you can change this interface from `message` to `...messages`
 * if you want to preserve the original signature of `console.log`.
 */
