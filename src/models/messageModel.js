import mongoose from "mongoose";

let messageSchema = new mongoose.Schema({
  sender : {
    id : String , 
    username : String , 
    avatar : String 
  },
  receiver : {
    id : String , 
    username : String , 
    avatar : String 
  },
  text : String , 
  file : {data : Buffer, contentType : String, filename : String},
  createdAt : {type : Number, default : Date.now},
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null},
})

module.exports = mongoose.model("message", messageSchema);
