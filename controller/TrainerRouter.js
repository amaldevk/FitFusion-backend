const express=require("express")
const TrainerModel=require("../models/TrainerModel")
const { model } = require("mongoose")

const router=express.Router()

router.post("/addtrainer",async(req,res)=>{
    let data=req.body
    let trainers=new TrainerModel(data)
    let result=await trainers.save()
    res.json({
        status:"success"
    })

})

router.get("/viewtrainers",async(req,res)=>{
    let data = await TrainerModel.find()
    res.json(data)
})

module.exports=router