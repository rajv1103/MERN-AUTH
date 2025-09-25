import mongoose  from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    otp:{type:String,default:''},
    verifyat:{type:Number,default:0},
    isVerified:{type:Boolean,default:0},
    reset:{type:String,default:''},
    resetOtpExpAt:{type:Number,default:0},
})

const userModel=mongoose.models.user||mongoose.model('user',userSchema);

export default userModel;