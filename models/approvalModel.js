// PendingApproval model for MongoDB
const mongoose = require("mongoose");

const pendingApprovalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // Reference to the User model
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PendingApproval", pendingApprovalSchema);
