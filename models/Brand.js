const mongoose = require('mongoose');
const brandSchema = require(_base + 'schemas/Brand');

//建立索引，也可以放在程序外部建立
// querySchema.index({key: 1});

module.exports = mongoose.model('Brand', brandSchema);
