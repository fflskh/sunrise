const mongoose = require('mongoose');
const dealerSchema = require(_base + 'schemas/Dealer');

module.exports = mongoose.model('Dealer', dealerSchema);
