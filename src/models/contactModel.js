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
  }
}

module.exports = mongoose.model("contact", contactSchema);
