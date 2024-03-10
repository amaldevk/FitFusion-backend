const express = require("express");
const approvalModel = require("../models/approvalModel");
const memberModel = require("../models/memberModel");
const router = express.Router()

// Admin approval endpoint
router.get("/pending-approvals", async (req, res) => {
    try {
        // Fetch pending approvals from the database
        const pendingApprovals = await approvalModel.find().populate('userId');
        res.json(pendingApprovals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/approve-user", async (req, res) => {
    try {
        const { emailid, approved } = req.body;

        if (approved === undefined || approved === null) {
            return res.status(400).json({ message: "Approval status is required" });
        }

        // Remove the pending approval entry
        await approvalModel.findOneAndDelete({ emailid });

        // Update the user status based on the approval status
        await memberModel.findByIdAndUpdate(emailid, { status: approved ? "approved" : "not approved" });

        res.json({ message: "User approval status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
