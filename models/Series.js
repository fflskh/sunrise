const mongoose = require('mongoose');
const seriesSchema = require(_base + 'schemas/Series');

//建立索引，也可以放在程序外部建立
// querySchema.index({key: 1});

module.exports = mongoose.model('Series', seriesSchema);
