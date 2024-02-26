const mongoose=require("mongoose")

const packageschema=new mongoose.Schema(
    {
        memberid:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        package:{
            type:String,
            required:true
        },
        paymentStatus:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        }
    }
)

module.exports=mongoose.model("packages",packageschema)