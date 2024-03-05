// historyApi.js

const express = require('express');
const router = express.Router();
const historyModel = require('../models/historyModel');

router.post('/packagehistory', async (req, res) => {
    const { userId, oldPackageId, newPackageId, updatedAt } = req.body;

    try {
        const historyEntry = await historyModel.create({
            userId,
            oldPackageId,
            newPackageId,
            updatedAt
        });

        res.status(201).json({ message: 'Update history stored successfully', historyEntry });
    } catch (error) {
        console.error('Error storing update history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.get('/viewhistory', async (req, res) => {
    try {
        const historyEntries = await historyModel.find().sort({ updatedAt: -1 }).populate({
            path: 'userId',
            select: 'name' // Assuming 'username' is the field representing the user name in the 'usergym' collection
        }).populate({
            path: 'oldPackageId',
            select: 'packageName price' // Assuming 'packageName' is the field representing the package name in the 'packages' collection
        }).populate({
            path: 'newPackageId',
            select: 'packageName price' // Assuming 'packageName' is the field representing the package name in the 'packages' collection
        });

        res.status(200).json({ historyEntries });
    } catch (error) {
        console.error('Error fetching update history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;


