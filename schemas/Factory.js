/**
 * 省份
 */
const Schema = require('mongoose').Schema;

const FactorySchema = new Schema({
    brandId: {type: Schema.Types.ObjectId, desc: '品牌ID'},
    name: {type: String, desc: '大的系列'}
}, {
    collection: 'factories', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = FactorySchema;
