// // updateHistoryModel.js

// const mongoose = require('mongoose');

// const updateHistorySchema = new mongoose.Schema({
//     userId: {
//         type : mongoose.Schema.Types.ObjectId,
//             required : true,
//             ref : "usergym"
//     },
//     oldPackageId: {
//         type : mongoose.Schema.Types.ObjectId,
        
//             ref : "packages"
//     },
//     newPackageId: {
//         type : mongoose.Schema.Types.ObjectId,
//             required : true,
//             ref : "packages"
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('UpdateHistory', updateHistorySchema);



const mongoose = require('mongoose');

const packageHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usergym',
        required: true
    },
    oldPackageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages',
        
    },
    newPackageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages',
        required: true
    },
    refund: {
        type: Number,
        default: 0
    },
    payToAdmin: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('UpdateHistory', packageHistorySchema);

 


