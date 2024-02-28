const express=require("express")
const router=express.Router()
const transModel=require("../models/transactionModel")



router.get("/viewall", async (req, res) => {
    try {
        let result = await transModel.find()
            .populate([
                { 
                    path: "userid", 
                    select: "name " 
                },
                { 
                    path: "packageid", 
                    select: "packagename price duration" 
                }
            ])
            .exec();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/viewuser", async (req, res) => {
    try {
        let data=req.body
        let result = await transModel.find(data)
            .populate([
                { 
                    path: "userid", 
                    select: "name " 
                },
                { 
                    path: "packageid", 
                    select: "packagename price duration" 
                }
            ])
            .exec();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/transpost",async(req,res)=>{
    let data=req.body
    let post=new transModel(data)
    let result=await post.save()
    res.json({
        status:"success"
    })
})

module.exports=router