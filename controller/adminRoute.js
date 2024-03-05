const express = require("express")
const memberModel = require("../models/memberModel")
const jwt = require("jsonwebtoken")

const router = express.Router()

//view the registered members
router.get("/viewregistered",async(req,res)=>{

    let data = await memberModel.find()
    res.json(data)

})


//admin updates the payment status of registered members(registration fee)
router.post("/update",async(req,res)=>{
    console.log(req.body)
    let {id,...rest} = req.body
    console.log(rest)
    let data = await memberModel.updateOne({_id:id},rest)
    res.json({
        status:"success"
    })
})

router.post("/delete",async(req,res)=>{
    console.log(req.body)
    let {id} = req.body
    console.log(id)
    let data = await memberModel.deleteOne({_id:id})
    res.json({
        status:"success"
    })
})

router.post("/adminlogin",async(req,res)=>{
    let input=req.body
    let username="admin"
    let password="admin"
    if (input.username == "admin" && input.password == "admin") {
        return res.json({
            status:"success"
        })
    }
    else{
        res.json({
            status:"Invalid credentials"
        })
    }
})








module.exports = router