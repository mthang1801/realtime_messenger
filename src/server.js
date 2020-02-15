import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
var app = express();

//connect to mongodb
connectDB();

//config view engine
configViewEngine(app);

//initial all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST , () => {
  console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`);
})
