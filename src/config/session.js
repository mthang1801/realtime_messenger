import session from 'express-session';
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);
/**
 * This variable is save session at mongodb
 */
let sessionStore = new MongoStore({
  url : `${process.env.DB_CONNECT}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect : true
})
/**
 * Create a session middleware with the given options
 */

let configSession = (app) => {
   app.use(session({
      key : "express.sid",
      secret : "mySecret",
      store : sessionStore, 
      resave : true ,
      saveUninitialized : false ,
      cookie : {
        maxAge : 1000 * 3600 * 24
      }
   }))
}

module.exports = configSession;
