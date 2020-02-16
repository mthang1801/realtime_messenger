import mongoose from "mongoose";

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
    verifyToken : String
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
  deletedAt : {type : Number, default : null},
})

userSchema.statics = {
  createNew(item){
    return this.create(item);
  },
  findByEmail(email){
    return this.findOne({"local.email" : email}).exec();
  }
}
module.exports = mongoose.model("user", userSchema);

