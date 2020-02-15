import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
var app = express();

//connect to mongodb
connectDB();

//config view engine
configViewEngine(app);

app.get("/", (req, res) => {
  res.render("main/master");
})

app.get("/login-register" , (req, res) => {
  res.render("authentication/loginRegister");
})

app.listen(process.env.APP_PORT, process.env.APP_HOST , () => {
  console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`);
})
