// updateHistoryModel.js

const mongoose = require('mongoose');

const updateHistorySchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "usergym"
    },
    oldPackageId: {
        type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "packages"
    },
    newPackageId: {
        type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "packages"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UpdateHistory', updateHistorySchema);

