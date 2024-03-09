function calculateDueAmount(duePackage) {
    let oldPackageAmount = 0;
    let dueAmount = 0;

    if (duePackage.lastUpdateDate) {
        oldPackageAmount = duePackage.packageId.price;
        const workoutDays = Math.ceil((new Date() - new Date(duePackage.lastUpdateDate)) / (1000 * 60 * 60 * 24));
        const oldPackageAmountperWork = parseFloat(oldPackageAmount) / 30 * workoutDays;
        dueAmount = oldPackageAmountperWork + duePackage.packageId.price;
    } else {
        oldPackageAmount = parseFloat(duePackage.previousPackageAmount);
        dueAmount = oldPackageAmount;
    }

    return dueAmount;
}

// module.exports = {
//     calculateDueAmount,
// };
