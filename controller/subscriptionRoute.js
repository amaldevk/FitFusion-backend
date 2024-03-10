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
    const token = req.headers["token"];
    jwt.verify(token, "gym", async (error, decoded) => {
        if (decoded && decoded.email) {
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
                //const prepkgdate = existingSubscription.subscriptionDate;
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
// Store package update in history along with refund and payment to admin await 
axios.post("http://localhost:3006/api/history/packagehistory", {
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
        } else {
            status: "unauthorized user";
        }
    });
});
router.post("/update", async (req, res) => {
    try {
        const { userId, newPackageId } = req.body;
        // console.log("Current Package:", currentPackage);
        // console.log("New Package:", newPackage);


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

        // Retrieve the date and duration of the old package
        const oldPackageDate = new Date(existingSubscription.subscriptionDate);
        const oldPackageDuration = currentPackage.duration;

        // Retrieve the duration of the new package
        const newPackageDuration = newPackage.duration;

        // Calculate refund and payment to admin if the package is updated on the same day
        const currentDate = new Date();
        const packageSelectedDate = oldPackageDate;
        const newPackageSelectedDate = new Date(existingSubscription.updatedAt);
        let refund = 0;
        let payToAdmin = 0;

        if (
            currentDate.getFullYear() === packageSelectedDate.getFullYear() || newPackageSelectedDate.getFullYear() &&
            currentDate.getMonth() === packageSelectedDate.getMonth() || newPackageSelectedDate.getMonth() &&
            currentDate.getDate() === packageSelectedDate.getDate() || newPackageSelectedDate.getDate()
        ) {
            if (newPackage.price > currentPackage.price) {
                payToAdmin = newPackage.price - currentPackage.price;
            } else if (currentPackage.price < newPackage.price) {
                refund = currentPackage.price - newPackage.price;
            }
        }

        // Update the user's subscription with the new package
        // existingSubscription.packageId = newPackageId;
        // await existingSubscription.save();
        // Update the user's subscription with the new package and set lastUpdateDate
        existingSubscription.packageId = newPackageId;
        existingSubscription.lastUpdateDate = new Date(); // Set the update date
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
});


// router.post("/due", async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const existingSubscription = await subscriptionModel.findOne({ userId });

//         if (!existingSubscription) {
//             return res.status(404).json({ message: "No package found for the user" });
//         }

//         const currentPackage = await packageModel.findById(existingSubscription.packageId);

//         let dueAmount = 0;
//         let remainingDaysForDue = 0;
//         const currentDate = new Date();
//         const packageSelectedDate = new Date(existingSubscription.subscriptionDate);

//         const workoutDays = Math.ceil((currentDate - packageSelectedDate) / (1000 * 60 * 60 * 24));
//         remainingDaysForDue = 30 - (workoutDays % 30);

//         let oldPackageAmount = 0;

//         if (existingSubscription.lastUpdateDate) {
//             oldPackageAmount = existingSubscription.packageId.price;
//             const oldPackageAmountperWork = parseFloat(oldPackageAmount) / 30 * workoutDays;
//             dueAmount = oldPackageAmountperWork + existingSubscription.packageId.price;
//         } else {
//             oldPackageAmount = parseFloat(existingSubscription.previousPackageAmount);
//             dueAmount = oldPackageAmount;
//         }

//         const result = {
//             name: existingSubscription.userId.name,
//             emailid: existingSubscription.userId.emailid,
//             packageName: currentPackage.packageName,
//             packagePrice: currentPackage.price,
//             dueAmount: dueAmount.toFixed(2),
//             remainingDaysForDue: remainingDaysForDue >= 0 ? remainingDaysForDue : 0
//         };

//         res.json(result);
//     } catch (error) {
//         console.error("Error in finding due:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
//});
router.post("/due", async (req, res) => {
    const { userId } = req.body;

    try {
        const existingSubscription = await subscriptionModel.findOne({ userId });

        if (!existingSubscription) {
            return res.status(404).json({ message: "No package found for the user" });
        }

        const currentPackage = await packageModel.findById(existingSubscription.packageId);

        let dueAmount = 0;
        let remainingDaysForDue = 0;
        let oldPackageDuration = 0;
        let newPackageDuration = 0;
        let oldPackageUpdateDate;
        let newPackageUpdateDate;

        const currentDate = new Date();
        const packageSelectedDate = new Date(existingSubscription.subscriptionDate);

        const workoutDays = Math.ceil((currentDate - packageSelectedDate) / (1000 * 60 * 60 * 24));

        let oldPackageAmount = 0;

        if (existingSubscription.lastUpdateDate) {
            oldPackageAmount = existingSubscription.packageId.price;
            const oldPackageAmountperWork = parseFloat(oldPackageAmount) / 30 * workoutDays;
            dueAmount = oldPackageAmountperWork + existingSubscription.packageId.price;

            // Extract the numeric value from the old package duration and multiply by 30
            const oldPackage = await packageModel.findById(existingSubscription.packageId);
            oldPackageDuration = extractNumericValue(oldPackage.duration) * 30;

            // Retrieve the update date of the old package
            oldPackageUpdateDate = existingSubscription.lastUpdateDate;
        } else {
            oldPackageAmount = parseFloat(existingSubscription.previousPackageAmount);
            dueAmount = oldPackageAmount;

            // Extract the numeric value from the old package duration and multiply by 30
            oldPackageDuration = extractNumericValue(existingSubscription.packageId.duration) * 30;

            oldPackageUpdateDate = existingSubscription.subscriptionDate;
        }

        // Extract the numeric value from the new package duration and multiply by 30
        newPackageDuration = extractNumericValue(currentPackage.duration) * 30;

        // Calculate the due amount based on the provided formula
        dueAmount = (currentPackage.price / newPackageDuration) * (workoutDays % 30);

        // Calculate the remaining days for due using new package duration
        remainingDaysForDue = newPackageDuration - (workoutDays % 30);

        // Retrieve the update date of the new package
        newPackageUpdateDate = existingSubscription.lastUpdateDate || existingSubscription.subscriptionDate;

        const result = {
            name: existingSubscription.userId.name,
            emailid: existingSubscription.userId.emailid,
            packageName: currentPackage.packageName,
            packagePrice: currentPackage.price,
            dueAmount: dueAmount.toFixed(2),
            oldPackageDuration,
            newPackageDuration,
            oldPackageUpdateDate,
            newPackageUpdateDate,
            remainingDaysForDue: remainingDaysForDue >= 0 ? remainingDaysForDue : 0
        };

        res.json(result);
    } catch (error) {
        console.error("Error in finding due:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Function to extract the numeric value from a string like "3 months"
function extractNumericValue(durationString) {
    const numericValue = parseInt(durationString); // Extracts the numeric part
    return isNaN(numericValue) ? 0 : numericValue; // Returns 0 if the conversion is not successful
}




// router.get("/due", async (req, res) => {
//     try {
//         const subscriptions = await subscriptionModel.find().populate({
//             path: "userId",
//             select: "name emailid"
//         }).populate({
//             path: "packageId",
//             select: "packageName price duration" // Include the price field from the package document
//         });

//         const subscriptionDetails = await Promise.all(
//             subscriptions.map(async (subscription) => {
//                 let dueAmount = 0;
//                 let remainingDaysForDue = 0;
//                 const currentDate = new Date();
//                 const packageSelectedDate = new Date(subscription.subscriptionDate);

//                 const workoutDays = Math.ceil((currentDate - packageSelectedDate) / (1000 * 60 * 60 * 24));
//                 remainingDaysForDue = 30 - (workoutDays % 30);

//                 let oldPackageAmount = 0;
//                 if (subscription.lastUpdateDate) {
//                     oldPackageAmount = subscription.packageId.price; // Retrieve the price of the previous package
//                     const oldPackageAmountperWork = parseFloat(oldPackageAmount) / 30 * workoutDays;
//                     dueAmount = oldPackageAmountperWork + subscription.packageId.price; // Add the price of the new package
//                 } else {
//                     oldPackageAmount = parseFloat(subscription.previousPackageAmount);
//                     dueAmount = oldPackageAmount;
//                 }

//                 return {
//                     name: subscription.userId.name,
//                     emailid: subscription.userId.emailid,
//                     packageName: subscription.packageId.packageName,
//                     packagePrice: subscription.packageId.price, // Include the price of the package
//                     dueAmount: dueAmount.toFixed(2),
//                     remainingDaysForDue: remainingDaysForDue >= 0 ? remainingDaysForDue : 0
//                 };
//             })
//         );

//         res.json(subscriptionDetails);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });
router.post("/update-and-due", async (req, res) => {
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
            (currentDate.getFullYear() === packageSelectedDate.getFullYear() || newpackageSelectedDate.getFullYear()) &&
            (currentDate.getMonth() === packageSelectedDate.getMonth() || newpackageSelectedDate.getMonth()) &&
            (currentDate.getDate() === packageSelectedDate.getDate() || newpackageSelectedDate.getDate())
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

        // Calculate due amount
        let dueAmount = 0;
        let remainingDaysForDue = 0;
        let oldPackageDuration = 0;
        let newPackageDuration = 0;
        let oldPackageUpdateDate;
        let newPackageUpdateDate;

        const workoutDays = Math.ceil((currentDate - packageSelectedDate) / (1000 * 60 * 60 * 24));

        let oldPackageAmount = 0;

        if (existingSubscription.lastUpdateDate) {
            oldPackageAmount = existingSubscription.packageId.price;
            const oldPackageAmountperWork = parseFloat(oldPackageAmount) / 30 * workoutDays;
            dueAmount = oldPackageAmountperWork + existingSubscription.packageId.price;

            // Extract the numeric value from the old package duration and multiply by 30
            const oldPackage = await packageModel.findById(existingSubscription.packageId);
            oldPackageDuration = extractNumericValue(oldPackage.duration) * 30;

            // Retrieve the update date of the old package
            oldPackageUpdateDate = existingSubscription.lastUpdateDate;
        } else {
            oldPackageAmount = parseFloat(existingSubscription.previousPackageAmount);
            dueAmount = oldPackageAmount;

            // Extract the numeric value from the old package duration and multiply by 30
            oldPackageDuration = extractNumericValue(existingSubscription.packageId.duration) * 30;

            oldPackageUpdateDate = existingSubscription.subscriptionDate;
        }

        // Extract the numeric value from the new package duration and multiply by 30
        newPackageDuration = extractNumericValue(newPackage.duration) * 30;

        // Calculate the due amount based on the provided formula
        dueAmount = (newPackage.price / newPackageDuration) * (workoutDays % 30);

        // Calculate the remaining days for due using new package duration
        remainingDaysForDue = newPackageDuration - (workoutDays % 30);

        // Retrieve the update date of the new package
        newPackageUpdateDate = existingSubscription.lastUpdateDate || existingSubscription.subscriptionDate;

        const result = {
            name: existingSubscription.userId.name,
            emailid: existingSubscription.userId.emailid,
            packageName: newPackage.packageName, // Using new package name
            packagePrice: newPackage.price, // Using new package price
            dueAmount: dueAmount.toFixed(2),
            oldPackageDuration,
            newPackageDuration,
            oldPackageUpdateDate,
            newPackageUpdateDate,
            remainingDaysForDue: remainingDaysForDue >= 0 ? remainingDaysForDue : 0
        };

        res.json(result);
    } catch (error) {
        console.error("Error updating and calculating due:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Function to extract the numeric value from a string like "3 months"
function extractNumericValue(durationString) {
    const numericValue = parseInt(durationString); // Extracts the numeric part
    return isNaN(numericValue) ? 0 : numericValue; // Returns 0 if the conversion is not successful
}


// router.post("/update-and-due", async (req, res) => {
//     const { userId, newPackageId } = req.body;

//     try {
//         // Check if the user already has a selected package
//         const existingSubscription = await subscriptionModel.findOne({ userId });

//         if (!existingSubscription) {
//             return res.status(404).json({ message: "No package found for the user" });
//         }

//         // Retrieve the current and new package details
//         const currentPackage = await packageModel.findById(existingSubscription.packageId);
//         const newPackage = await packageModel.findById(newPackageId);

//         if (!currentPackage || !newPackage) {
//             return res.status(404).json({ message: "Package not found" });
//         }

//         // Calculate refund and payment to admin if the package is updated on the same day
//         const currentDate = new Date();
//         const packageSelectedDate = new Date(existingSubscription.subscriptionDate);
//         const newpackageSelectedDate = new Date(existingSubscription.updatedAt);
//         let refund = 0;
//         let payToAdmin = 0;

//         // if (
//         //     (currentDate.getFullYear() === packageSelectedDate.getFullYear() || newpackageSelectedDate.getFullYear()) &&
//         //     (currentDate.getMonth() === packageSelectedDate.getMonth() || newpackageSelectedDate.getMonth()) &&
//         //     (currentDate.getDate() === packageSelectedDate.getDate() || newpackageSelectedDate.getDate())
//         // ) {
//         //     if (newPackage.price > currentPackage.price) {
//         //         payToAdmin = newPackage.price - currentPackage.price;
//         //     } else if (currentPackage.price < newPackage.price) {
//         //         refund = currentPackage.price - newPackage.price;
//         //     }
//         // }

//         // Update the user's subscription with the new package
//         existingSubscription.packageId = newPackageId;
//         await existingSubscription.save();

//         // Store package update in history along with refund and payment to admin
//         await axios.post("http://localhost:3006/api/history/packagehistory", {
//             userId,
//             oldPackageId: currentPackage._id,
//             newPackageId,
//             refund,
//             payToAdmin,
//             updatedAt: new Date(),
//         });

//         // Calculate due amount and duration for both old and new packages
//         const dueAmountOldPackage = calculateDueAmount(existingSubscription, currentPackage);
//         const oldPackageDuration = calculatePackageDuration(existingSubscription.packageId);

//         const dueAmountNewPackage = calculateDueAmount(currentPackage, newPackage);
//         const newPackageDuration = calculatePackageDuration(newPackage);

//         // Calculate total due amount by adding old and new package due amounts
//         const totalDueAmount = dueAmountOldPackage + dueAmountNewPackage;

//         // Calculate remaining days for due using new package duration
//         const workoutDays = Math.ceil((currentDate - packageSelectedDate) / (1000 * 60 * 60 * 24));
//         const remainingDaysForDue = newPackageDuration - (workoutDays % 30);

//         // Retrieve the update date of the new package
//         const newPackageUpdateDate = existingSubscription.lastUpdateDate || existingSubscription.subscriptionDate;

//         const result = {
//             name: existingSubscription.userId.name,
//             emailid: existingSubscription.userId.emailid,
//             packageName: currentPackage.packageName,
//             packagePrice: currentPackage.price,
//             totalDueAmount: totalDueAmount.toFixed(2),
//             oldPackageDuration,
//             newPackageDuration,
//             oldPackageUpdateDate: existingSubscription.lastUpdateDate,
//             newPackageUpdateDate,
//             remainingDaysForDue: remainingDaysForDue >= 0 ? remainingDaysForDue : 0
//         };

//         res.json(result);
//     } catch (error) {
//         console.error("Error updating package:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// // Function to calculate due amount for a package
// function calculateDueAmount(oldPackage, newPackage) {
//     const workoutDays = Math.ceil((new Date() - new Date(oldPackage.subscriptionDate)) / (1000 * 60 * 60 * 24));
//     const dueAmount = (newPackage.price / calculatePackageDuration(newPackage)) * (workoutDays % 30);
//     return dueAmount;
// }

// // Function to calculate package duration in days
// function calculatePackageDuration(packageDetails) {
//     return extractNumericValue(packageDetails.duration) * 30;
// }

// // Function to extract the numeric value from a string like "3 months"
// function extractNumericValue(durationString) {
//     const numericValue = parseInt(durationString); // Extracts the numeric part
//     return isNaN(numericValue) ? 0 : numericValue; // Returns 0 if the conversion is not successful
// }




module.exports = router