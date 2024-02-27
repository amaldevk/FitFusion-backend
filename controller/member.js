const express=require("express")
const memberModel=require("../models/memberModel")

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
    let user=new memberModel(data)
    let result=await user.save()
    res.json(
        {
            status:"success"
        }
    )
})

router.post("/login",async(req,res)=>{
    let input=req.body
    let username=req.body.username
    let data=await gymModel.findOne({"username":username})
    if (!data) {
        return res.json({
            status:"Invalid user"
        })
    }
    console.log(data)
    let dbpassword=data.password
    let inputpassword=req.body.password
    console.log(dbpassword)
    console.log(inputpassword)
    const match=await bcrypt.compare(inputpassword,dbpassword)
    if (!match) {
        return res.json({
            status:"Incorrect password"
        })
    }
    res.json({
        status:"success"
    })
})

router.get("/viewregistered",async(req,res)=>{

    let data = await memberModel.find()
    res.json(data)

})

router.get("/MemberDetails", async (req, res) => {
    try {
        const members = await memberModel.find({})
            .populate("username", "-_id")
            .select("-_id name paymentStatus age contactno emailid gender bloodgroup height weight idproof");

        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/update",async(req,res)=>{
    console.log(req.body)
    let {id,...rest} = req.body
    console.log(rest)
    let data = await memberModel.updateOne({_id:id},rest)
    res.json({
        status:"success"
    })
})

module.exports=router