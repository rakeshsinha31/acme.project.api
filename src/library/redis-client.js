const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

module.exports = { GET_ASYNC, SET_ASYNC };
