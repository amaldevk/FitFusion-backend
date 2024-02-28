const express=require("express")
const packagemodel=require("../models/packageModel")

const router=express.Router()

router.post("/addpackage",async(req,res)=>{
    let data=req.body
    let package=new packagemodel(data)
    let result=await package.save()
    res.json({
        status:"success"
    })
})

router.get("/viewpackage",async(req,res)=>{
    let result =await packagemodel.find()
    res.json({result,"packageid":result})
})

module.exports=router


