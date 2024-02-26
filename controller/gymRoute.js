const express=require("express")
const gymModel=require("../models/gymModel")

const router=express.Router()

const bcrypt=require("bcryptjs")

hashPasswordgenerator=async(pass)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

router.post("/signup",async(req,res)=>{
    let{data}={"data":req.body}
    let password=data.password
    const hashedPassword=await hashPasswordgenerator(password)
    data.password=hashedPassword
    let user=new gymModel(data)
    let result=await user.save()
    res.json(
        {
            status:"success"
        }
    )
})

module.exports=router