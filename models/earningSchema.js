const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalEarnings: { type: Number, default: 0 }, // Total ever paid
    payoutRequests: [{
        customerId: String,
        product: String,
        price: Number,
        earnings: Number,
        status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
        messageId: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Earning', earningSchema);
