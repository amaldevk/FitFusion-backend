const mongoose=require("mongoose")

const packageschema=new mongoose.Schema(
    {

        packageName:{
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        },
        duration:{
            type:String,
            required:true
        }
    }
)

module.exports=mongoose.model("packages",packageschema)