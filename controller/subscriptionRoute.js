const express = require("express")
const subscriptionModel = require("../models/subscriptionModel");

const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const packageModel = require("../models/packageModel");


const router = express.Router()



router.post("/select", async (req, res) => {
    const { userId, packageId } = req.body;

    try {
        // Check if the user already has a selected package
        const existingSubscription = await subscriptionModel.findOne({ userId });

        if (existingSubscription) {
            return res.status(400).json({ message: "User already has a selected package" });
        }

        // Create a new subscription for the selected package
        const newSubscription = new subscriptionModel({ userId, packageId });
        await newSubscription.save();
        
        // Store package selection in history
        await axios.post('http://localhost:3006/api/history/packagehistory', {
            userId,
            newPackageId: packageId,
            updatedAt: new Date()
        });

        res.status(201).json({ message: "Package selected successfully" });
    } catch (error) {
        console.error("Error selecting package:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}); 





router.post("/selected", async (req, res) => {
    

    const token = req.headers["token"]
    jwt.verify(token,"gym",async(error,decoded)=>{
        if (decoded && decoded.email) {
            
            const { userId } = req.body;

    try {
        const selectedPackages = await subscriptionModel.find({ userId }).populate("packageId");
        res.json(selectedPackages);
    } catch (error) {
        console.error("Error fetching selected packages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

        } else {
            status : "unauthorized user"
        }
    })
});



router.post("/update", async (req, res) => {
    //const token = req.headers["token"];
    //jwt.verify(token, "gym", async (error, decoded) => {
        //if (decoded && decoded.email) {
            const { userId, newPackageId } = req.body;

            try {
                // Check if the user already has a selected package
                const existingSubscription = await subscriptionModel.findOne({ userId });

                if (!existingSubscription) {
                    return res.status(404).json({ message: "No package found for the user" });
                }

                // Retrieve the current and new package details
                const currentPackage = await packageModel.findById(existingSubscription.packageId);
                const newPackage = await packageModel.findById(newPackageId);

                if (!currentPackage || !newPackage) {
                    return res.status(404).json({ message: "Package not found" });
                }

                // Calculate refund and payment to admin if the package is updated on the same day
                const currentDate = new Date();
                const packageSelectedDate = new Date(existingSubscription.subscriptionDate);
                const newpackageSelectedDate = new Date(existingSubscription.updatedAt);
                let refund = 0;
                let payToAdmin = 0;

                if (
                    currentDate.getFullYear() === packageSelectedDate.getFullYear() || newpackageSelectedDate.getFullYear() &&
                    currentDate.getMonth() === packageSelectedDate.getMonth() || newpackageSelectedDate.getMonth() &&
                    currentDate.getDate() === packageSelectedDate.getDate() || newpackageSelectedDate.getDate()
                ) {
                    if (newPackage.price > currentPackage.price) {
                        payToAdmin = newPackage.price - currentPackage.price;
                    } else if (currentPackage.price < newPackage.price) {
                        refund = currentPackage.price - newPackage.price;
                    }
                }

                // Update the user's subscription with the new package
                existingSubscription.packageId = newPackageId;
                await existingSubscription.save();

                // Store package update in history along with refund and payment to admin
                await axios.post("http://localhost:3006/api/history/packagehistory", {
                    userId,
                    oldPackageId: currentPackage._id,
                    newPackageId,
                    refund,
                    payToAdmin,
                    updatedAt: new Date(),
                });

                res.status(200).json({ message: "Package updated successfully" });
            } catch (error) {
                console.error("Error updating package:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        // } else {
        //     status: "unauthorized user";
        // }
    }
    );
//});














router.get("/due", async (req, res) => {
    try {
        const subscriptions = await subscriptionModel.find().populate({
            path: "userId",
            select: "name emailid"
        }).populate({
            path: "packageId",
            select: "packageName price duration" // Include the price field from the package document
        });

        const subscriptionDetails = await Promise.all(
            subscriptions.map(async (subscription) => {
                let dueAmount = 0;
                let remainingDaysForDue = 0;
                const currentDate = new Date();
                const packageSelectedDate = new Date(subscription.subscriptionDate);

                const workoutDays = Math.ceil((currentDate - packageSelectedDate) / (1000 * 60 * 60 * 24));
                remainingDaysForDue = 30 - (workoutDays % 30);

                let oldPackageAmount = 0;
                if (subscription.lastUpdateDate) {
                    oldPackageAmount = subscription.packageId.price; // Retrieve the price of the previous package
                    const oldPackageAmountperWork = parseFloat(oldPackageAmount) / 30 * workoutDays;
                    dueAmount = oldPackageAmountperWork + subscription.packageId.price; // Add the price of the new package
                } else {
                    oldPackageAmount = parseFloat(subscription.previousPackageAmount);
                    dueAmount = oldPackageAmount;
                }

                return {
                    name: subscription.userId.name,
                    emailid: subscription.userId.emailid,
                    packageName: subscription.packageId.packageName,
                    packagePrice: subscription.packageId.price, // Include the price of the package
                    dueAmount: dueAmount.toFixed(2),
                    remainingDaysForDue: remainingDaysForDue >= 0 ? remainingDaysForDue : 0
                };
            })
        );

        res.json(subscriptionDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router