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
  }
};

userSchema.methods = {
  comparePassword(password){
    return bcrypt.compare(password,this.local.password); // return true or false 
  }
}
module.exports = mongoose.model("user", userSchema);

