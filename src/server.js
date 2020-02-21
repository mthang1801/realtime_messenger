import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import passport from "passport";
import pem from "pem";
import https from "https";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import passportSocketIo from "passport.socketio";
import session from "./config/session";
import configPassportIO from "./config/socketIO";
let app = express();
//Init server with socket.io and express
let server = http.createServer(app);
let io = socketio(server);

//connect to mongodb
connectDB();

//config session
session.config(app);

//config view engine
configViewEngine(app);

//enable post data by requesting
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//config passport with middleware
app.use(passport.initialize());
app.use(passport.session());

//enable flash message
app.use(connectFlash());

//enable cookie parser
app.use(cookieParser());

//initial all routes
initRoutes(app);

//config passportSocketIO
configPassportIO(cookieParser, session.sessionStore, io);

//init socket 
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST , () => {
  console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`);
})


