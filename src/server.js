import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";
var app = express();


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
