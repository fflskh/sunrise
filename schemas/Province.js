/**
 * 评论，针对口碑的评论
 */
const Schema = require('mongoose').Schema;

const provinceSchema = new Schema({
    provinceid: {type: Number, desc: '省份ID，从网页上获取的'},
    name: {type: String, desc: '名称'},
    list: [{
        cityid: {type: Number, desc: '城市ID，从网页上获取的'},
        name: {type: String, desc: '名称'}
    }]
}, {
    collection: 'provinces', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = provinceSchema;
