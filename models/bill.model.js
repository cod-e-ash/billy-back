const mongoose = require('mongoose');
const Joi = require('joi');

const Bill = mongoose.Schema({
    billno: {type: String, required: true},
    filename: {type: String, required: true},
    date: {type: Date, default: new Date()}
});

function validateBill(bill) {
    const billSchema = {
        billno: Joi.string().required(),
        filename: Joi.string().required(),
        date: Joi.date().default(Date.now)
    };

    return Joi.validate(bill, billSchema);
}

module.exports.Bill = mongoose.model('Bill', bill);
module.exports.validate = validateBill;