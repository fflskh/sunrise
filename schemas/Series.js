/**
 * 系列，例如宝马3系，5系等
 */
const Schema = require('mongoose').Schema;

const seriesSchema = new Schema({
    name: {type: String, desc: '系列名称'},
    guidancePrice: {
        min: Number,
        max: Number,
        desc: '指导价'
    },
    years: [{type: String, desc: '年份'}],
    images: [{
        type: {type: String, desc: '描述，例如外观、内饰、细节等'},
        url: {type: String},
        extra: {type: Schema.Types.Mixed}
    }],
    displacement: {type: String, desc:'排量'},
    colors: [{type: String}],
    stars: {type: Number, desc: '评分'},
    engine: [{type: String, desc: '发动机'}],
    gearbox: {type: String, desc: '变速箱'},
    carriage: {type: String, desc: '车身结构，几厢'},
    bodyType: {type: String, desc: '车身类型，如：掀背车'},
    models: [{type: Schema.Types.Mixed, desc: '车型'}]

}, {
    collection: 'series', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = seriesSchema;
