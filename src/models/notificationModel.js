import mongoose from "mongoose";

let notificationSchema = new mongoose.Schema({
  senderId : String , 
  receiverId : String ,
  type : String ,   
  isRead : {type : Boolean, default : false},
  membersRead : [{userId : String}],
  createdAt : {type : Number, default : Date.now},
  deletedAt : {type : Number, default : null}
})

notificationSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  findNotificationByReceiverId(userId, limit){
    return this.find({"receiverId" : userId}).sort({"createdAt" : -1}).limit(limit).exec();
  },
  findNotificationByGroupId(groupId){
    return this.find({"receiverId" : groupId}).sort({"createdAt": -1}).exec();
  },
  getUnreadNotificationByReceiverId(userId){
    return this.find({"receiverId" : userId, "isRead" : false}).sort({"createdAt" : -1}).exec();
  },
  readMoreNotification(userId, skipNumber, limit){
    return this.find({"receiverId": userId}).sort({"createdAt": -1}).skip(skipNumber).limit(limit).exec()
  },
  findNotificationByIdAndUpdate(id){
    return this.findByIdAndUpdate(id, {"isRead" : true}, {new : true}).exec();
  },
  getAllNotificationsByReceiverId(receiverId){
    return this.find({receiverId: receiverId}).sort({"createdAt" : -1}).exec();
  },
  updateAllNotificationAsRead(userId){
    return this.updateMany({"receiverId": userId}, {isRead: true},{new : true}).exec();
  },
  /**
   * 
   * @param {string} userId 
   * @param {string} notificationId 
   * check userId has whether existed in membersRead, if it has existed , do not solve, else push it into membersRead
   */
  findNotificationByIdAndPushMemberIdToMembersRead(userId, notificationId){
    return this.findOneAndUpdate(
      {"_id" : notificationId, "membersRead" : {$not : {$elemMatch : { "userId" : userId}}}},
      {$push : {membersRead : {"userId" : userId}}}, {new : true}).exec();
  },
  findNotificationById(id){
    return this.findById(id).exec();
  },
  pushMemberIdIntoNotificationWithReceiverIdIsGroupId(userId, groupId){
    return this.updateMany(
      {"receiverId" : groupId, "membersRead" : {$not : {$elemMatch : { "userId" : userId}}}},
      {$push : {"membersRead" : {"userId" : userId}}},
      {new : true}
    ).exec();
  },
  countUnreadNotificationByReceiverId(userId){
    return this.count({"receiverId" : userId, "isRead" : false}).exec();
  },
  countUnreadNotificationsGroupChat(userId, groupId){
    return this.count({"receiverId": groupId, "membersRead" : {$not : {$elemMatch : { "userId" : userId}}}, "senderId" : {$ne : userId}}).exec();
  }
}

let NOTIFICATION_TYPES = {
  ADD_CONTACT : "add_contact",
  ACCEPT_CONTACT : "accept_contact",
  CREATE_NEW_GROUP : "create_new_group",
  UPDATE_GROUP : "update_group",
  UPDATE_AVATAR_GROUP : "update_avatar_group"
};

let NOTIFICATION_CONTENTS = {
  getContent : (id, type, isRead, userId, userName, userAvatar, timer, groupId=null, groupName=null, oldGroupName=null) => {
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
    if(type == NOTIFICATION_TYPES.ACCEPT_CONTACT){
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
                        đã chấp nhận lời mời kết bạn của bạn
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
                        đã chấp nhận lời mời kết bạn của bạn
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
    if(type == NOTIFICATION_TYPES.CREATE_NEW_GROUP){
      if(!isRead){
        return `
                <li class="card-notifications__item notification-group card-unread" data-notification-uid="${id}" data-uid="${userId}" data-group-uid=${groupId}>
                  <div class="card-notifications__avatar">
                    <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
                  </div>
                  <div class="card-notifications__text">
                    <div class="card-notifications__text--primary">
                      <span class="card-notifications__text--primary--username">
                        ${userName}
                      </span>
                      <span class="Card-notifications__text--primary--content">
                        đã thêm bạn vào  <strong style="color:#d62e18">${groupName}</strong>
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
                <li class="card-notifications__item notification-group" data-notification-uid="${id}" data-uid="${userId}" data-group-uid=${groupId}>
                  <div class="card-notifications__avatar">
                    <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
                  </div>
                  <div class="card-notifications__text">
                    <div class="card-notifications__text--primary">
                      <span class="card-notifications__text--primary--username">
                        ${userName}
                      </span>
                      <span class="Card-notifications__text--primary--content">
                        đã thêm bạn vào  <strong style="color:#d62e18">${groupName}</strong>
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
    if(type == NOTIFICATION_TYPES.UPDATE_GROUP){
      if(!isRead){
        return `
                <li class="card-notifications__item notification-group card-unread" data-notification-uid="${id}" data-uid="${userId}" data-group-uid=${groupId}>
                  <div class="card-notifications__avatar">
                    <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
                  </div>
                  <div class="card-notifications__text">
                    <div class="card-notifications__text--primary">
                      <span class="card-notifications__text--primary--username">
                        ${userName}
                      </span>
                      <span class="Card-notifications__text--primary--content">
                        đã đổi tên group <strong style="color:#d62e18;text-decoration:line-through">${oldGroupName}</strong> thành <strong style="color:#3b5998">${groupName}</strong>
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
                <li class="card-notifications__item notification-group" data-notification-uid="${id}" data-uid="${userId}" data-group-uid=${groupId}>
                  <div class="card-notifications__avatar">
                    <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
                  </div>
                  <div class="card-notifications__text">
                    <div class="card-notifications__text--primary">
                      <span class="card-notifications__text--primary--username">
                        ${userName}
                      </span>
                      <span class="Card-notifications__text--primary--content">
                      đã đổi tên group <strong style="color:#d62e18;text-decoration:line-through">${oldGroupName}</strong> thành <strong style="color:#3b5998">${oldGroupName}</strong>
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
    if(type == NOTIFICATION_TYPES.UPDATE_AVATAR_GROUP){
      if(!isRead){
        return `
                <li class="card-notifications__item notification-group card-unread" data-notification-uid="${id}" data-uid="${userId}" data-group-uid=${groupId}>
                  <div class="card-notifications__avatar">
                    <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
                  </div>
                  <div class="card-notifications__text">
                    <div class="card-notifications__text--primary">
                      <span class="card-notifications__text--primary--username">
                        ${userName}
                      </span>
                      <span class="Card-notifications__text--primary--content">
                        đã thay đổi ảnh đại diện <strong style="color:#d62e18">${oldGroupName}</strong> 
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
                <li class="card-notifications__item notification-group" data-notification-uid="${id}" data-uid="${userId}" data-group-uid=${groupId}>
                  <div class="card-notifications__avatar">
                    <img src="images/users/${userAvatar}" class="card-notifications__avatar-image">
                  </div>
                  <div class="card-notifications__text">
                    <div class="card-notifications__text--primary">
                      <span class="card-notifications__text--primary--username">
                        ${userName}
                      </span>
                      <span class="Card-notifications__text--primary--content">
                      đã thay đổi ảnh đại diện <strong style="color:#d62e18">${oldGroupName}</strong> 
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

