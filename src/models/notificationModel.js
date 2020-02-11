import mongoose from "mongoose";

let notificationSchema = new mongoose.Schema({
  sender: {
    id : String ,
    username : String, 
    avatar : String
  },
  receiver : {
    id : String ,
    username : String , 
    avatar : String 
  },
  type : String , 
  content : String , 
  isRead : {type : Boolean, default : false},
  createdAt : {type : Number, default : Date.now},
  updatedAt : {type : Number, default : null} ,
  deletedAt : {type : Number, default : null} ,
})

module.exports = mongoose.model("notification" , notificationSchema);

