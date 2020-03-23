import mongoose from "mongoose";

let chatGroupSchema = new mongoose.Schema({
  name : String ,
  oldName : {type : String , default : null },
  userAmount : {type : Number, max : 199},
  messageAmount : {type : Number, default  : 0},
  admins : [{userId : String, appointedAt : {type : Number, default : Date.now}}],
  members : [{userId : String, joinedAt : {type : Number, default : Date.now}}],
  avatar : {type : String, default : "group-avatar.jpeg"},
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
    return this.find({"members" : {$elemMatch : { "userId" : userId}}}).sort({"msgUpdatedAt" : -1}).exec();
  },
  findLimitedGroupConversationByUserId(userId, limit) {
    return this.find({"members" : {$elemMatch : { "userId" : userId}}}).sort({"msgUpdatedAt" : -1}).limit(limit).exec();
  },
  findLimitedGroupConversationByUserIdWithSkipNumbers(userId, skipNumbers, limit) {
    return this.find({"members" : {$elemMatch : { "userId" : userId}}}).sort({"msgUpdatedAt" : -1}).skip(skipNumbers).limit(limit).exec();
  },
  findGroupById(id){
    return this.findById(id).exec();
  },
  findGroupAndUpdateTimeWhenHasNewMessenger(id){
    return this.findByIdAndUpdate(id, {"msgUpdatedAt": Date.now()}, {new: true}).exec();
  },
  checkUserIsAdminAndUpdateBothAvatarAndName(userId, groupId, fileName, newGroupName, currentGroupName=null){
    if(currentGroupName == null || newGroupName == currentGroupName){
      return this.findOneAndUpdate(
        {"_id": groupId, "admins.0.userId" : userId }, 
        {"avatar": fileName, "name" : newGroupName, updatedAt : Date.now()}
        ).exec();
    }
    return this.findOneAndUpdate(
      {"_id": groupId, "admins.0.userId" : userId }, 
      {"avatar": fileName, "name" : newGroupName, updatedAt : Date.now(), "oldName" : currentGroupName}
      ).exec();
  },
  checkUserIsAdminAndUpdateGroupName(userId, groupId, newGroupName, currentGroupName){
    return this.findOneAndUpdate(
      {"_id": groupId, "admins.0.userId" : userId }, 
      {"name" : newGroupName, updatedAt : Date.now(), "oldName" : currentGroupName}
      ).exec();
  }
}
module.exports = mongoose.model("chat-group", chatGroupSchema);
