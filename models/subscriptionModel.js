
const mongoose = require("mongoose")

const subscribeSchema = new mongoose.Schema(
    {
        userId:{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "usergym"
        },
        packageId:{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "packages"
        },
        subscriptionDate:{
            type : Date,
            default:Date.now
        },
        lastUpdateDate: {
            type: Date
        }
    }
)

module.exports = mongoose.model("subscribepackages",subscribeSchema)