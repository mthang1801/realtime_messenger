import mongoose from "mongoose";

let chatGroupSchema = new mongoose.Schema({
  name : String ,
  userAmount : {type : Number, max : 199},
  messageAmount : {type : Number, default  : 0},
  admins : [{userId : String}],
  members : [{userId : String}],
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
  checkUserIsAdminAndUpdateBothAvatarAndName(userId, groupId, fileName, groupName){
    return this.findOneAndUpdate(
      {"_id": groupId, "admins.0.userId" : userId }, 
      {"avatar": fileName, "name" : groupName, updatedAt : Date.now()}
      ).exec();
  },
  checkUserIsAdminAndUpdateAvatar(userId, groupId, fileName){
    return this.findOneAndUpdate(
      {"_id": groupId, "admins.0.userId" : userId }, 
      {"avatar": fileName,  updatedAt : Date.now()}
      ).exec();
  },
  checkUserIsAdminAndUpdateGroupName(userId, groupId, groupName){
    return this.findOneAndUpdate(
      {"_id": groupId, "admins.0.userId" : userId }, 
      {"name" : groupName, updatedAt : Date.now()}
      ).exec();
  }
}
module.exports = mongoose.model("chat-group", chatGroupSchema);
