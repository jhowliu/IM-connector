const config = require('../config/redis');
const redis = require('redis');

const client = redis.createClient();

module.exports = client;
