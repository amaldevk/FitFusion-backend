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

router.post("/searchpackage", async (req, res) => {
    try {
        let data=req.body
        let result = await packageModel.findOne(data)
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/viewpackage",async(req,res)=>{
    let result =await packagemodel.find()
    res.json(result)
})



router.post("/packageselect",async(req,res)=>{
    let input=req.body
    let packageName=req.body.username
    let data=await packagemodel.findOne({"PackageName":packageName})
    

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




module.exports=router


