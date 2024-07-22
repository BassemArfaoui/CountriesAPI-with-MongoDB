import mongoose from "mongoose";


const userSchema = mongoose.Schema(
{
    email : {type : String , required : true},
    password : {type : String , required : true},
    bearer_token : {type : String , required : false}  
})


export default  mongoose.model('User', userSchema);
