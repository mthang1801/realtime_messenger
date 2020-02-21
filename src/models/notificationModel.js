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
  findNotificationByReceiverId(userId){
    return this.find({"receiverId" : userId}).exec();
  },
  getUnreadNotificationByReceiverId(userId){
    return this.find({"receiverId" : userId, "isRead" : false}).exec();
  }
}

let NOTIFICATION_TYPES = {
  ADD_CONTACT : "add_contact",
  ACCEPT_CONTACT : "accept_contact"
};

let NOTIFICATION_CONTENTS = {
  getContent : (id, type, isRead, userId, userName, userAvatar, timer) => {
    if(type == NOTIFICATION_TYPES.ADD_CONTACT){
      if(!isRead){
        return `
                <li class="card-notifications__item card-unread" data-notification-uid="${id}" data-uid="${userId}">
                  <div class="card-notifications__avatar">
                    <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
                  </div>
                  <div class="card-notifications__text">
                    <div class="card-notifications__text--primary">
                      <span class="card-notifications__text--primary--username">
                        ${userName}
                      </span>
                      <span class="Card-notifications__text--primary--content">
                        đã gửi cho bạn một lời mời kết bạn
                      </span>
                    </div>
                    <div class="card-notifications__text--sub">
                      ${timer}
                    </div>
                  </div>
                </li>
              `
      }else{
        return `
        <li class="card-notifications__item" data-notification-uid="${id}" data-uid="${userId}">
          <div class="card-notifications__avatar">
            <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
          </div>
          <div class="card-notifications__text">
            <div class="card-notifications__text--primary">
              <span class="card-notifications__text--primary--username">
                ${userName}
              </span>
              <span class="Card-notifications__text--primary--content">
                đã gửi cho bạn một lời mời kết bạn 
              </span>
            </div>
            <div class="card-notifications__text--sub">
              ${timer}
            </div>
          </div>
        </li>
      `
      }
    }
   
  }
}

module.exports = {
  model : mongoose.model("notification" , notificationSchema),
  types : NOTIFICATION_TYPES, 
  contents : NOTIFICATION_CONTENTS
}

