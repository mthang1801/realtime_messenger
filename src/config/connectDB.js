import mongoose from "mongoose";
import bluebird from "bluebird";

/**
 * Connect mongodb
 */

const DB_CONNECT = "mongodb";
const DB_HOST = "localhost";
const DB_PORT = "27017";
const DB_NAME = "awesome_chat"
const DB_USER = "";
const DB_PASSWORD = "";

let connectDB = () => {
  mongoose.Promise = bluebird;
  let URI = `${DB_CONNECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  return mongoose.connect(URI, {useNewUrlParser : true});
}


module.exports = connectDB;
