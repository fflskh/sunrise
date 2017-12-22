/**
 * 汽车品牌
 */
const Schema = require('mongoose').Schema;

const brandSchema = new Schema({
    name: {type: String, desc: '品牌'},
    image: {type: Schema.Types.Mixed, desc: '品牌图片'},
    firstChar: {type: String, desc: '首字母'}
}, {
    collection: 'brands', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = brandSchema;
