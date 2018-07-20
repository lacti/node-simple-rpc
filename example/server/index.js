const rpc = require('../../lib/rpc');
const procedures = require('./procedures');

rpc(8192, procedures);
