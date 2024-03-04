const mongoose=require("mongoose")

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        dateofbirth:{
            type:String,
            required:true
        },
        age:{
            type:String,
            required:true
        },
        contactno:{
            type:String,
            required:true
        },
        emailid:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            required:true
        },
        bloodgroup:{
            type:String,
            required:true
        },
        height:{
            type:String,
            required:true
        },
        weight:{
            type:String,
            required:true
        },
        idproof:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        password:{
            type:String, 
            required:true
        },
        paymentStatus:String,
        
        
    }
)

module.exports=mongoose.model("usergym",userSchema)