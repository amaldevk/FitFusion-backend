const express=require("express")
const packagemodel=require("../models/packageModel")
const packageModel = require("../models/packageModel")

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
    res.json(result)
})



router.post("/packageselect",async(req,res)=>{
    let input=req.body
    let packageid=req.body._id
    console.log(packageid)
    let data=await packagemodel.findOne({"_id":packageid})

    console.log(data)
    res.json({
        status:"success","userdata":data
    })
})


router.post("/deletepackage",async(req,res)=>{
    console.log(req.body)
    let{id}=req.body
    console.log(id)
    let data=await packageModel.deleteOne({_id:id})
    res.json({
        "status":"success"
    })
})

router.post("/updatepackage",async(req,res)=>{
    console.log(req.body)
    let {id,...rest} = req.body
    console.log(rest)
    let data=await packageModel.updateOne({_id:id},rest)
    res.json({
        status:"success"
    })
})


module.exports=router


