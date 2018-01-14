const mongoose = require('mongoose');
const provinceSchema = require(_base + 'schemas/Province');

module.exports = mongoose.model('Province', provinceSchema);
