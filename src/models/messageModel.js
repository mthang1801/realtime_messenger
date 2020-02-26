import mongoose from "mongoose";

let messageSchema = new mongoose.Schema({
  senderId : String , 
  receiverId : String,
  conversationType : String ,
  messageType : String, 
  sender : {
    username : String , 
    avatar : String 
  },
  receiver : {
    username : String , 
    avatar : String 
  },
  text : String , 
  file : {data : Buffer, contentType : String, filename : String},
  isBlocked : {type : Boolean, default : false},
  createdAt : {type : Number, default : Date.now},
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null},
});

messageSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  getMessengersByUserId(userId){
    return this.find({
      $and : [        
        {
          $or : [
            {"sender.id" : userId},
            {"receiver.id" : userId}
          ]
        },
        {
          "isBlocked" : false
        },
        {
          "deletedAt" : {$in : [false, null]}
        }
      ]
    }).exec();
  },
  findAllPrivateMessages(userId, deprecatedArray){
    return this.find({
      $and : [
        {
          $or : [
            {"senderId" : userId},
            {"receiverId" : userId},
          ]
        },
        { "receiverId" : {$nin : deprecatedArray} },
        { isBlocked : false },
        { deletedAt : {$in : [false, null]} }
      ]
    }).sort({"createdAt": -1}).exec();
  },
  findAllGroupMessages(listGroupsId){
    return this.find({"receiverId" : {$in : listGroupsId}, "conversationType" : CONVERSATION_TYPE.GROUP}).sort({"createdAt" : -1}).exec();
  }
}

let MESSAGE_TYPE = {
  TEXT : "text",
  IMAGE : "image",
  FILE : "file"
}

let CONVERSATION_TYPE = {
  PRIVATE : "private",
  GROUP : "group"
}

module.exports = {
  model : mongoose.model("message", messageSchema),
  conversationType : CONVERSATION_TYPE,
  messageType : MESSAGE_TYPE 
}
