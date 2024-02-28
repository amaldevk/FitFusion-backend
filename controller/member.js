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
    let data=await memberModel.findOne({"username":username})
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
        status:"success","userdata":data
    })
})


    router.get("/view",async(req,res)=>{
        let data=await postmodel.find()
        .populate("username","name age address emailid -_id")
        .exec()
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

router.post("/search",async(req,res)=>{
    let input=req.body
    let name=req.body.name
    let data=await memberModel.find({"name":name})
   
    if (!data ||data.length === 0) {
        return res.json({
            status:"Invalid user"
        })
    }
    else{
        const responseData = data.map(user => ({
            name: user.name,
            address: user.address,
            weight: user.weight,
            height: user.height,
            idproof: user.idproof,
            emailid: user.emailid,
            contactno: user.contactno
        }))

        console.log(responseData);

        return res.json(responseData);
    } 
    
})





module.exports=router