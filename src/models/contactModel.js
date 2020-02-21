import mongoose from "mongoose";

let contactSchema = new mongoose.Schema({
  userId : String , 
  contactId : String , 
  status : {type : Boolean, default : false},
  createdAt : {type : Number, default : Date.now},
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
  getContactByUserId(userId){
    return this.find({"userId" : userId}).exec();
  },
  /**
   * 
   * @param {string: as contactId in database} userId 
   */
  getContactByContactId(userId){
    return this.find({"contactId" : userId}).exec();
  }
}

module.exports = mongoose.model("contact", contactSchema);
