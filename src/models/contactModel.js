import mongoose from "mongoose";

let contactSchema = new mongoose.Schema({
  userId : String , 
  contactId : String , 
  status : {type : Boolean, default : false},
  createdAt : {type : Number, default : Date.now},
  blockList : [{type : String, default : null }],
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null},
  msgUpdatedAt : {type :Number, default : null },
  otherProps : {listUsersIdRemoved : [{userId : String}]}
}, {upsert :true, strict : false});

contactSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  findContact(userId, contactId){
    return this.findOne({
      $or : [
        {
          $and : [
            {"userId": userId},
            {"contactId": contactId}
          ]
        },
        {
          $and : [
            {"userId": contactId},
            {"contactId": userId}
          ]
        }
      ]
    }).exec();
  },
  findAllContactWithStatusTrueByUserId(currentUserId){
    return this.find(
      {
        $and :[
          {
            $or : [
              {"userId": currentUserId},
              {"contactId": currentUserId}
            ]
          },
          { 
            "status" : true 
          }
        ]        
      }).exec()
  },
  findAllContactWithStatusFalseByUserId(currentUserId){
    return this.find(
      {
        $and :[
          {
            $or : [
              {"userId": currentUserId},
              {"contactId": currentUserId}
            ]
          },
          { 
            "status" : false
          }
        ]        
      }).exec()
  },
  /**
   * 
   * @param {string} userId 
   * @param {string} contactId 
   * check contact in database whether exist 
   */
  checkContactExist(userId, contactId) {
    return this.findOne({
      $or : [
        { 
          $and : [
            {"userId" : userId,},
            {"contactId" : contactId}            
          ]
        },
        { 
          $and : [
            {"userId" : contactId},
            {"contactId" : userId}
          ]
        }
      ]
    }).exec();
  },
  checkAndRemoveContact(userId, contactId) {
    return this.findOneAndDelete({"userId" : userId, "contactId" : contactId}).exec();
  },
  /**
   * 
   * @param {string} userId 
   * get contact list with userId as sending request add contact
   */
  getLimitedContactStatusFalseByUserId(userId,limit, skip=0){
    return this.find({"userId" : userId , "status" : false}).sort({"createdAt" : -1}).skip(skip).limit(limit).exec();
  },
  /**
   * 
   * @param {string: as contactId in database} userId 
   */
  getContactStatusFalseByContactId(userId, limit, skip=0){
    return this.find({"contactId" : userId , "status" : false}).sort({"createdAt" : -1}).skip(skip).limit(limit).exec();
  },
  /**
   * 
   * @param {string} userId 
   * @param {string} contactId 
   * update status and updatedAt
   */
  updateContactStatusAsTrueAndCreateTimeMessage(userId, contactId){
    return this.findOneAndUpdate(
      {"userId" : userId, "contactId" : contactId},
      {"status" : true, updatedAt : Date.now(), "msgUpdatedAt": Date.now()},
      { new: true, upsert: true}).exec();
  },
  getContactListByUserId(userId){
    return this.find({
      $and : [
        { 
          $or : [
           {"userId" : userId},
           {"contactId" : userId}
          ]
        },
        {"status" : true }
      ]
    }).sort({"username" : 1}).exec();
  },
  /**
   * 
   * @param {string: current User} userId 
   * @param {string:target User} contactId 
   * delete contact with condition status true
   */
  removeContact(userId, contactId){
    return this.deleteOne({
      $and : [
        {
          $or : [
            {
              $and : [
                {"userId" : userId},
                {"contactId" : contactId}
              ]
            },
            {
              $and : [
                {"userId" : contactId},
                {"contactId" : userId}
              ]
            }
          ]
        },
        {
          "status" : true 
        }
      ]
    }).exec();
  },
  countContactSentByUserId(userId){
    return this.countDocuments({"userId" :userId , "status" : false}).exec();
  },
  countContactReceivedByContactId(userId){
    return this.countDocuments({"contactId" :userId , "status" : false}).exec();
  },
  findContactExactly(userId, contactId){
    return this.findOne({"userId" : userId, "contactId" : contactId}).exec();
  },
  getLimitedContactListFromMsgUpdatedAt(userId, limit){
    return this.find({
      $and : [
        { 
          $or : [
           {"userId" : userId},
           {"contactId" : userId}
          ]
        },
        {"status" : true },
        {"msgUpdatedAt" : {$ne : null  }},
        {"otherProps.listUsersIdRemoved" : {$not :  { $elemMatch : { "userId" :  userId }}}}
      ]
    }).sort({"msgUpdatedAt" : -1}).limit(limit).exec();
  },
  getLimitedContactListFromMsgUpdatedAtWithSkipNumber(userId, skipNumbers, limit){
    return this.find({
      $and : [
        { 
          $or : [
           {"userId" : userId},
           {"contactId" : userId}
          ]
        },
        {"status" : true },
        {"msgUpdatedAt" : {$ne : null }},
        {"otherProps.listUsersIdRemoved" : {$not : {$elemMatch : { "userId" : userId}}}}
      ]
    }).sort({"msgUpdatedAt" : -1}).skip(skipNumbers).limit(limit).exec();
  }, 
  updateTimeWhenHasNewMessage(userId, contactId){
    return this.findOneAndUpdate(
      {
        $and : [
          {
            $or : [
              {
                $and : [
                  {"userId" : userId},
                  {"contactId" : contactId}
                ]
              },
              {
                $and : [
                  {"userId" :contactId},
                  {"contactId" : userId}
                ]
              }
            ]
          },
          {"status" : true}
        ]
      },
      {
        $set :{  "msgUpdatedAt" : Date.now() },
        $pull : { "otherProps.listUsersIdRemoved": {"userId" : {$in : [userId, contactId]}} }         
      },
      {
         new : true
      }
    ).exec();
  },
  pushUserIdToRemoveMessagesList(userId, contactId){
    return this.updateMany(
      {
        $or : [
          {"userId" : userId, "contactId" : contactId},
          {"userId" : contactId, "contactId" : userId},
        ]
      },
      { $push : { "otherProps.listUsersIdRemoved" : {"userId" : userId}}},
      {
        "fields" : {
          "new" : true, 
          "upsert" : true
        }
      }
    ).exec();
  }
}

module.exports = mongoose.model("contact", contactSchema);
