const express=require("express")
const router=express.Router()
const transModel=require("../models/transactionModel")



router.get("/viewall", async (req, res) => {
    try {
        let result = await transModel.find()
            .populate([
                { 
                    path: "userid", 
                    select: " id name " 
                },
                { 
                    path: "packageid", 
                    select: "packageName price duration" 
                }
            ])
            .exec();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// router.post("/viewuser", async (req, res) => {
//     try {
//         let data=req.body
//         let result = await transModel.find(data)
//             .populate([
//                 { 
//                     path: "userid", 
//                     select: "name " 
//                 },
//                 { 
//                     path: "packageid", 
//                     select: "packagename price duration" 
//                 }
//             ])
//             .exec();
//         res.json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });
router.post("/viewuser", async (req, res) => {
    const { userId } = req.body; // Retrieve from the request body for a POST request
    
    try {
        // Find the latest transaction for the specified user
        let result = await transModel.find({ 'userid': userId })
            .sort({ 'postdate': -1 }) // Sort by postdate in descending order
            .limit(1) // Limit the result to one document (the latest transaction)
            .populate(
                { path: "userid", select: "name" })
            .populate({ path: "packageid", select: "packagename price duration" })
            .exec();
      
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// router.post("/viewuser", async (req, res) => {
//     const { userId } = req.body; // Retrieve from the request body for a POST request
    
//     try {
//       let result = await transModel.find({ 'userid': userId })
//         .populate(
//           { path: "userid", select: "name" })
//           .populate({ path: "packageid", select: "packagename price duration" })
//         .exec();
      
//       res.json(result);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error", error: error.message });
//     }
//   });
  


router.post("/transpost",async(req,res)=>{
    let data=req.body
    let post=new transModel(data)
    let result=await post.save()
    res.json({
        status:"success"
    })
})

module.exports=router