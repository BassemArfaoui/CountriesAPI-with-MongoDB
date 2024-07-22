import mongoose from "mongoose";


const apiSchema = new mongoose.Schema({
    apikey:{
        type:String,
        required:true
    }
})


export default  mongoose.model("Apikey",apiSchema);

