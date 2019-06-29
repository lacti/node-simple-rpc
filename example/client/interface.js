/*
 * Define methods that only have a signature. Their implementation
 * are placed in a RPC server. This object, that is `exports`, would
 * be overwritten by `proxy` module to call the remote procedure in
 * a RPC server.
 *
 * Because of this, a server should have all implementations of these methods
 * to call properly but there is no hard constraints for this,
 * so it can be broken.
 */

/**
 * A stub method for `add` function that adds two numbers.
 * It will be overwritten by `proxy` module to request a call context
 * to a RPC server and return its result as a Promise object.
 */
module.exports.add = (a, b) => {
  // This is a stub method so it should not have an implementation.
};
