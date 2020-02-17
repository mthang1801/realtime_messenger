import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";
import pem from "pem";
import https from "https";

//#region config selfSiged (SSL) to login fb or google
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//   let app = express()
  
//   //connect to mongodb
//   connectDB();

//   //config session
//   configSession(app);

//   //config view engine
//   configViewEngine(app);

//   //enable post data by requesting
//   app.use(bodyParser.urlencoded({extended: true}));
//   app.use(bodyParser.json());

//   //config passport with middleware
//   app.use(passport.initialize());
//   app.use(passport.session());

//   //enable flash message
//   app.use(connectFlash());

//   //initial all routes
//   initRoutes(app);

//   // app.listen(process.env.APP_PORT, process.env.APP_HOST , () => {
//   //   console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`);
//   // })

 
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST , () => {
//     console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`);
//   })
// })

//#endregion

let app = express();
//connect to mongodb
connectDB();

//config session
configSession(app);

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

//initial all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST , () => {
  console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`);
})
