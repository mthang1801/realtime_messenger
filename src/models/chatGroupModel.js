import mongoose from "mongoose";

let chatGroupSchema = new mongoose.Schema({
  name : String ,
  userAmount : {type : Number, max : 199},
  messageAmount : {type : Number, default  : 0},
  admin : [{userId : String}],
  members : [{userId : String}],
  avatar : {type : String, default : "group-avatar.png"},
  createdAt : {type : Number, default : Date.now},
  msgUpdatedAt : {type : Number, default : Date.now},
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null},
})

chatGroupSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  findGroupConversationByUserId(userId) {
    return this.find({"members" : {$elemMatch : { "userId" : userId}}}).sort({"createdAt" : -1}).exec();
  },
  findGroupById(id){
    return this.find(id).exec();
  },
  findGroupAndUpdateTimeWhenHasNewMessenger(id){
    return this.findOneAndUpdate(id, {"msgUpdatedAt": Date.now()}, {new: true}).exec();
  }
}
module.exports = mongoose.model("chat-group", chatGroupSchema);
