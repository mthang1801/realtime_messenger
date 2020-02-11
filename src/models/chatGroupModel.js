import mongoose from "mongoose";

let chatGroupSchema = new mongoose.Schema({
  name : String ,
  userAmount : {type : Number, min : 3},
  messageAmount : {type : Number, default  : 0},
  hostId : Number , 
  admin : [{userId : Number}],
  members : [{userId : Number}],
  createdAt : {type : Number, default : Date.now},
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null},
})

module.exports = mongoose.model("chat-group", chatGroupSchema);
