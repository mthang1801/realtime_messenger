import mongoose from "mongoose";

let notificationSchema = new mongoose.Schema({
  senderId : String , 
  receiverId : String ,
  type : String ,   
  isRead : {type : Boolean, default : false},
  createdAt : {type : Number, default : Date.now},
  deletedAt : {type : Number, default : null}
})

notificationSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  findNotificationByUserId(userId){
    return this.find({"receiverId" : userId}).exec();
  }
}

let NOTIFICATION_TYPES = {
  ADD_CONTACT : "add_contact",
  ACCEPT_CONTACT : "accept_contact"
};

let NOTIFICATION_CONTENTS = {

}

module.exports = {
  model : mongoose.model("notification" , notificationSchema),
  types : NOTIFICATION_TYPES, 
  contents : NOTIFICATION_CONTENTS
}

