import mongoose from "mongoose";
import bcrypt from "bcrypt";

let userSchema = new mongoose.Schema({
  username : String, 
  gender : {type : String , default : "male"},
  phone : {type : String, default : null} , 
  address : {type : String, default : null} , 
  avatar : {type: String, default : "avatar-default.jpg"},
  role : {type : String, default : "user"},
  isBlocked : {type : Boolean, default : false},
  local : {
    email : {type : String, trim : true},
    password : String,
    isActive : {type : Boolean, default : false},
    verifyToken : String,
    verifyNumber : Number
  },
  google : {
    uid : String ,
    token : String , 
    email : {type : String, trim : true}
  },
  facebook : {
    uid : String,
    token : String , 
    email : {type : String, trim : true}
  },
  createdAt : {type : Number, default : Date.now},
  updatedAt : {type : Number, default : null},
  deletedAt : {type : Number, default : null}
})

userSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  removeUserById(id){
    return this.remove({"_id" : id}).exec();
  },
  findByEmail(email){
    return this.findOne({"local.email" : email}).exec();
  },
  activeAccount(token){
    return this.findOneAndUpdate(
      {"local.verifyToken" : token},
      {"local.verifyToken" :null, "local.isActive" : true}
    ).exec();
  },
  findUserById(id){
    return this.findById(id,{"local.password" : 0}).exec();
  },
  findUserByIdHasPassword(id){
    return this.findById(id).exec();
  },
  findUserByFacebookUID(uid){
    return this.findOne({"facebook.uid" : uid}).exec();
  },
  findUserByGoogleUID(uid){
    return this.findOne({"google.uid" : uid}).exec();
  },
  findUserAndCreateNumberVerify(email){
    return this.findOneAndUpdate({"local.email" : { $regex : new RegExp(email, "i")}}, {"local.verifyNumber": Math.round(Math.random()*1000000) }, {new : true}).exec();
  },
  findUserByEmailAndVerifyNumber(email, verifyNumber){
    return this.findOne({"local.email" : email, "local.verifyNumber" : verifyNumber}).exec();
  },
  FindUserByEmailAndUpdateNewPassword(email, hashPassword){
    return this.findOneAndUpdate({"local.email" : email}, {"local.password" : hashPassword, "local.verifyNumber" : null}, {new : true}).exec();
  },
  updateUserAvatar(userId, userUpdateItem){
    return this.findByIdAndUpdate(
      userId, 
      userUpdateItem,
      {
        "local.password": 0 , "role" : 0 , "isBlocked" : 0, "local.isActive" : 0
      }).exec();
  },
  updateUserInfo(userId, userUpdateItem){
    return this.findByIdAndUpdate(
      userId, 
      userUpdateItem,
      {
        "fields" : {"username" : 1, "gender" : 1, "address" : 1, "phone" : 1},
        "new": true
      }).exec();
  },
  findUserByIdAndUpdateNewPassword(userId, hashPassword){
    return this.findByIdAndUpdate(
      userId, 
      {"local.password": hashPassword}, 
      {
        "fields" : {"local.password": 0},
        "new" : true
      }
      ).exec();
  },
  findUserWithDeprecatedUsersId(deprecatedUsersId, searchKey){
    return this.find({
      $and : [
        {"_id" : { $nin : deprecatedUsersId}},
        {"local.isActive" : true},
        {
          $or : [
            {"username" : { $regex : new RegExp(searchKey, "i")}},
            {"local.email" : {$regex : new RegExp(searchKey, "i")}},
            {"google.email" : {$regex : new RegExp(searchKey, "i")}},
            {"facebook.email" : {$regex : new RegExp(searchKey, "i")}}
          ]
        }
      ]
    },{ "username" : 1, "local.email" : 1, "facebook.email": 1, "google.email" : 1, "address" : 1 , "phone" : 1, "avatar" : 1, "gender" : 1}).exec();
  },
  findLimitedUserWithDeprecatedUsersId(deprecatedUsersId, searchKey, limit){
    return this.find({
      $and : [
        {"_id" : { $nin : deprecatedUsersId}},
        {"local.isActive" : true},
        {
          $or : [
            {"username" : { $regex : new RegExp(searchKey, "i")}},
            {"local.email" : {$regex : new RegExp(searchKey, "i")}},
            {"google.email" : {$regex : new RegExp(searchKey, "i")}},
            {"facebook.email" : {$regex : new RegExp(searchKey, "i")}}
          ]
        }
      ]
    },{ "username" : 1, "local.email" : 1, "facebook.email": 1, "google.email" : 1, "address" : 1 , "phone" : 1, "avatar" : 1, "gender" : 1}).limit(limit).exec();
  },
  findUserWithDeprecatedUsersIdAndSkipNumber(deprecatedUsersId, searchKey, skipNumber){
    return this.find({
      $and : [
        {"_id" : { $nin : deprecatedUsersId}},
        {"local.isActive" : true},
        {
          $or : [
            {"username" : { $regex : new RegExp(searchKey, "i")}},
            {"local.email" : {$regex : new RegExp(searchKey, "i")}},
            {"google.email" : {$regex : new RegExp(searchKey, "i")}},
            {"facebook.email" : {$regex : new RegExp(searchKey, "i")}}
          ]
        }
      ]
    },{ "username" : 1, "local.email" : 1, "facebook.email": 1, "google.email" : 1, "address" : 1 , "phone" : 1, "avatar" : 1, "gender" : 1}).skip(skipNumber).exec();
  },
  findSeenerInfoById(id){
    return this.findById(id, {"username" : 1, "avatar" : 1 , "_id" : 1}).exec();
  },
  findUsersToAddNewGroup(listId, searchKey){
    return this.find({
      $and : [
        {"_id": {$nin : listId}} ,
        { 
          $or : [
            {"username" : {$regex : new RegExp("^" + searchKey + "$","i")}},
            {"local.email" : {$regex : new RegExp("^" + searchKey + "$", "i")}} ,
            {"facebook.email" : {$regex : new RegExp("^" + searchKey + "$", "i")}} ,
            {"google.email" : {$regex : new RegExp("^" + searchKey + "$", "i")}} ,
            {"phone" : searchKey}
          ]
        }
      ]
    },{"local.password" : 0}).exec();
  }
};

userSchema.methods = {
  comparePassword(password){
    return bcrypt.compare(password,this.local.password); // return true or false 
  }
}
module.exports = mongoose.model("user", userSchema);

