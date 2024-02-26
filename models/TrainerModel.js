const mongoose=require("mongoose")

const trainerschema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            required:true
        },
        phnno:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        experience:{
            type:String,
            required:true
        }
    }
)


module.exports=mongoose.model("trainer",trainerschema)