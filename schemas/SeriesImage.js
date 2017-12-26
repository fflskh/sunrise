/**
 * 系列 图片
 */
const Schema = require('mongoose').Schema;

const seriesImage = new Schema({
    seriesBriefId: {type: String, desc: 'series brief ID'},
    category: {type: String, desc: '外观、中控、细节、座椅等'},
    images: [{
        thumbnail: {type: Schema.Types.Mixed, desc: '缩略图'},
        standard: {type: Schema.Types.Mixed, desc: '标清'},
        high: {type: Schema.Types.Mixed, desc: '高清'}
    }]
}, {
    collection: 'seriesImages', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = seriesImage;

