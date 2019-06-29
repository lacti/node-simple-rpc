const rpc = require('../../lib/rpc');

// Load procedures to export as RPC.
const procedures = require('./procedures');

// Export all procedures via RESTful API to serve RPC.
rpc(8192, procedures);
