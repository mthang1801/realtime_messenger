import mongoose from "mongoose";

let contactSchema = new mongoose.Schema({
  userId : String , 
  contactId : String , 
  status : {type : Boolean, default : false},
  createdAt : {type : Number, default : Date.now},
  blockList : [{type : String, default : null }],
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null}
})

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
  updateContactStatusAsTrue(userId, contactId){
    return this.findOneAndUpdate({"userId" : userId, "contactId" : contactId},{"status" : true, updatedAt : Date.now()},{new :true}).exec();
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
    }).sort({"updatedAt" : -1}).exec();
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
  }
}

module.exports = mongoose.model("contact", contactSchema);
