import express from "express";
import connectDB from "./config/connectDB";
import contactModel from "./models/contactModel.js";
var app = express();

//connect to mongodb
connectDB();

app.get('/test-database', async (req, res) => {
  try{
    let item = {
      userId : "skajdk213hjhkas" , 
      contactId : "hewjheuiy2162" ,             
    }
    console.log(contactModel.createNew(item));
    let contact = await contactModel.createNew(item);  
    res.send(contact);
  }catch(err){
    console.log(err)
  }
});

app.listen(process.env.APP_PORT, process.env.APP_HOST , () => {
  console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`);
})
