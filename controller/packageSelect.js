const express=require("express")
const packageModel = require("../models/packageModel")

const router=express.Router()

router.post("/packageselect",async(req,res)=>{
    let input=req.body
    let username=req.body.username
    let data=await packageModel.findOne({"PackageName":PackageName})
    

    console.log(data)
    res.json({
        status:"success","userdata":data
    })
})
