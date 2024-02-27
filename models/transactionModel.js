const mongoose =require("mongoose")

const tranSchema=new mongoose.Schema(
    {
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"usergym"
        },
        packageid:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"package"
        },
        postdate:{
            type:Date,
            default:Date.now
        },

    }
)
module.exports=mongoose.model('transaction',tranSchema)

