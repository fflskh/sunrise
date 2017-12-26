/**
 * 系列简要信息
 */
const Schema = require('mongoose').Schema;

const briefSchema = new Schema({
    seriesId: {type: String, desc: 'series ID'},
    info: {type: String, desc: '车系列简要信息名称'},
    year: {type: String, desc: '哪年款'},
    recommend: {type: Boolean, desc: '是否推荐'},
    onSale: {type: Boolean, desc: '是否在售'},
    onProduce: {type: Boolean, desc: '是否在生产'},
    imagesUrl: {type: String, desc: '图片链接'},
    configUrl: {type: String, desc: '配置信息链接'},
    hasImageCrawled: {type: Boolean, desc: '是否已经爬取该brief信息对应的图片'},
    hasConfigCrawled: {type: Boolean, desc: '是否已经爬取该brief信息对应的配置'}
}, {
    collection: 'seriesBriefs', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = briefSchema;

