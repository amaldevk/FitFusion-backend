const express=require("express")
const router=express.Router()
const transModel=require("../models/transactionModel")

router.get("/viewall", async (req, res) => {
    try {
        let result = await transModel.find()
            .populate([
                { 
                    path: "userid", 
                    select: "name -address -dateofbirth -age -contactno -emailid -gender -bloodgroup -height -weight -idproof -username -password" 
                },
                { 
                    path: "packageid", 
                    select: "packagename price duration description" 
                }
            ])
            .exec();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/viewuser",async(req,res)=>{
    let data=req.body
    console.log(data)
    let result=await transModel.find(data)
    res.json(result)
})
router.post("/transpost",async(req,res)=>{
    let data=req.body
    let post=new transModel(data)
    let result=await post.save()
    res.json({
        status:"success"
    })
res.send("success")
})

module.exports=router