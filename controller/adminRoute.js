const express = require("express")
const memberModel = require("../models/memberModel")
const mongoose = require("mongoose");
const cors=require("cors")

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

// const ObjectId = mongoose.Types.ObjectId;

// router.delete("/delete", async (req, res) => {
//     console.log(req.body);
    
//     // Check if the 'id' is present in the request body
//     if (!req.body.id) {
//         return res.status(400).json({
//             status: "error",
//             message: "'id' is required in the request body",
//         });
//     }

//     let { id } = req.body;
//     console.log("Received ID:", id);

//     try {
//         // Use mongoose.Types.ObjectId to create ObjectId
//         const objectId = mongoose.Types.ObjectId(_id);

//         let data = await memberModel.deleteOne({ _id: objectId });

//         if (data.deletedCount === 0) {
//             // If deletedCount is 0, the document with the specified id was not found
//             return res.status(404).json({
//                 status: "error",
//                 message: "Document not found",
//             });
//         }

//         res.json({
//             status: "success",
//         });
//     } catch (error) {
//         console.error(error);

//         // Log the error details
//         console.error("Error details:", error);

//         // Send a more informative error response
//         res.status(500).json({
//             status: "error",
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// });


// router.delete("/delete",async(req,res)=>{
//     console.log(req.body)
//     let {id} = req.body
//     console.log(id)
//     //let data = await memberModel.deleteOne({_id:id})
//     let data = await memberModel.findByIdAndDelete(id);

//     console.log(data);
//     res.json({
//         status:"success"
//     })
//})
router.delete("/delete", async (req, res) => {
    console.log(req.body);
    let { id } = req.body;
    console.log(id);

    try {
        // Convert string ID to ObjectId
        let data = await memberModel.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({
                status: "error",
                message: "Document not found",
            });
        }

        console.log(data);
        res.json({
            status: "success",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
});



module.exports = router