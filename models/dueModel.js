const mongoose = require("mongoose");

const dueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "usergym"
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "packages"
    },
    dueAmount:{
        type: Number, 
        required: true,
    },
    remainingDaysForDue: {
        type: Number,
        required:true
    },
    subscriptionDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("duePackage",dueSchema);

