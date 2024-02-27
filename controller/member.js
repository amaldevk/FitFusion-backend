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



router.post("/MemberDetails", async (req, res) => {
    try {
        const members = await memberModel.find({}, {
            username: 1,
            paymentStatus: 1,
            name: 1,
            age: 1,
            contactno: 1,
            emailid: 1,
            gender: 1,
            bloodgroup: 1,
            height: 1,
            weight: 1,
            idproof: 1,
            _id: 0 // Excluding the _id field from the response
        });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





module.exports=router