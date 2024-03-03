const express = require("express")
const subscriptionModel = require("../models/subscriptionModel")

const router = express.Router()





router.post("/select", async (req, res) => {
    const { userId, packageId } = req.body;

    try {
        // Check if the user has already selected this package
        const existingSubscription = await subscriptionModel.findOne({ userId, packageId });
        if (existingSubscription) {
            return res.status(400).json({ message: "Package already selected by this user" });
        }

        // Create a new subscription
        const subscription = new subscriptionModel({ userId, packageId });
        await subscription.save();
        
        res.status(201).json({ message: "Package selected successfully" });
    } catch (error) {
        console.error("Error selecting package:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/selected", async (req, res) => {
    const { userId } = req.body;

    try {
        const selectedPackages = await subscriptionModel.find({ userId }).populate("packageId");
        res.json(selectedPackages);
    } catch (error) {
        console.error("Error fetching selected packages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router