const mongoose=require("mongoose")
const searchSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            ref:usergym
        }
    }
)
module.exports=mongoose.model("searchuser",searchSchema)