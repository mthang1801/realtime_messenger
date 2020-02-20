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
  findAllContactByUserId(currentUserId){
    return this.find(
      {
        $or : [
          {"userId": currentUserId},
          {"contactId": currentUserId}
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
  }
}

module.exports = mongoose.model("contact", contactSchema);
