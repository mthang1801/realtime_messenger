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
  file : {data : Buffer, contentType : String, fileName : String},
  hasReceived : {type : Boolean, default : false },
  groupSeen : [{userId : String}],
  hasSeen : {type : Boolean, default : false},
  seenAt : {type : Number, default : null},
  isBlocked : {type : Boolean, default : false},
  createdAt : {type : Number, default : Date.now},
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null},  
  otherProps : {listUsersIdRemoved : [{userId : String}]}
},{upsert : true, strict: false});

messageSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  /**
   * get all messengers of current and another user, then sort of decreasing timer
   * @param {string} currentUserId 
   * @param {string} anotherUserId 
   */
  getPrivateMessengers(currentUserId, anotherUserId, limit){
    return this.find({
      $and : [
        {
          $or : [
            {
              $and:  [
                { "senderId" : currentUserId},
                { "receiverId" : anotherUserId}
              ]
            },
            {
              $and: [
                { "senderId" : anotherUserId},
                { "receiverId" : currentUserId}
              ]
            }
          ]
        },
        { "isBlocked" : false },
        { "deletedAt" : null},
        { "otherProps.listUsersIdRemoved" : {$not : { $elemMatch : { "userId" :  currentUserId }}}}
      ]
    }).sort({"createdAt" : -1}).limit(limit).exec();
  },
  /**
   * groupId as receiverId , get all messenger from group
   * @param {string`} groupId 
   */
  getGroupMessengers( groupId, limit){
    return this.find({
      "receiverId" : groupId,
      "isBlocked" : false ,
      "deletedAt" : null
    }).sort({"createdAt" : -1}).limit(limit).exec();
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
  },
  updateStatusMessengerIsReceived(userId){
    return this.updateMany({
      $and : [
        { "receiverId" : userId},
        { "isBlocked" : false },
        { "deletedAt" : null}
      ]
    },{"hasReceived" : true}, {new : true}).exec();
  },
  updateMessageHasBeenReceived(id){
    return this.findByIdAndUpdate(id,{"hasReceived" : true}).exec();
  },
  updateHasSeenMessage(senderId, receiverId){
    return this.updateMany(
      {"senderId": senderId, "receiverId": receiverId}, 
      {"hasSeen" : true, "seenAt" : Date.now()}, 
    ).exec();
  },
  findMessengerByGroupId(groupId){
    return this.findOne({"receiverId": groupId}).sort({"createdAt" : -1}).exec();
  },
  pushUserIntoUsersHaveSeenAtGroup(userId, groupId){
    return this.updateMany(
      {"receiverId" : groupId , "groupSeen.userId" : {$ne : userId}},
      {$push : {"groupSeen" : {userId}}},
      {new : true}
    ).exec();
  },
  removeAllMessenger(userId, contactId){
    return this.deleteMany({
      $or : [
        {$and : [
          {"senderId" : userId},
          {"receiverId" :contactId}
          ]
        },
        {
          $and : [
            {"senderId" : contactId},
            {"receiverId" :userId}
          ]
        }
      ]
    }).exec();
  },
  readMoreMessengers(senderId, receiverId, skipNumber, limit){
    return this.find({
      $or : [
        {"senderId" : senderId, "receiverId" : receiverId},
        {"senderId" : receiverId, "receiverId" : senderId}
      ]
    }).sort({"createdAt" : -1}).skip(skipNumber).limit(limit).exec();
  },
  pushUserIdToRemoveMessagesList(userId, contactId){
    return this.updateMany(
      {
        $or : [
          {"senderId" : userId, "receiverId" : contactId},
          {"senderId" : contactId, "receiverId" : userId}
        ],
      },
      { $push : {"otherProps.listUsersIdRemoved" : {"userId" : userId}}},            
    ).exec();
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
