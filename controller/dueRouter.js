const express = require("express");
const dueModel = require("../models/dueModel");
const packageModel = require("../models/packageModel");
const memberModel = require("../models/memberModel");
const { calculateDueAmount } = require("./utility");

const router = express.Router();

router.get("/dueAmount", async (req, res) => {
    try {
        const duePackage = await dueModel.find().populate({
            path: "userId",
            select: "name emailid"
        }).populate({
            path: "packageId",
            select: "packageName price duration"
        });

        const DueDetails = await Promise.all(
            duePackage.map(async (duePackage) => {
                let dueAmount = calculateDueAmount(duePackage);
                let remainingDaysForDue = 0;

                const currentDate = new Date();
                const packageSelectedDate = new Date(duePackage.subscriptionDate);

                const workoutDays = Math.ceil((currentDate - packageSelectedDate) / (1000 * 60 * 60 * 24));
                remainingDaysForDue = 30 - (workoutDays % 30);

                return {
                    name: duePackage.userId.name,
                    emailid: duePackage.userId.emailid,
                    packageName: duePackage.packageId.packageName,
                    packagePrice: duePackage.packageId.price,
                    dueAmount: dueAmount.toFixed(2),
                    remainingDaysForDue: remainingDaysForDue >= 0 ? remainingDaysForDue : 0
                };
            })
        );

        res.json(DueDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
