/**
 * 口碑，对车辆的详细评论
 */
const Schema = require('mongoose').Schema;

const publicPraiseSchema = new Schema({
    seriesId: {type: String, desc: '车型'},
    userName: {type: String, desc: '用户名称'},
    title: {type: String, desc: '标题'},
    purchaseLocation: {type: String, desc: '购买地点'},
    purchaseDate: {type: String, desc: '购买时间'},
    price: {type: Number, desc: '价格'},
    fuelConsumption: {type: Number, desc: '油耗，单位：升/百公里'},
    mileage: {type: Number, desc: '行驶里程，单位：km'},
    stars: { //评分，总分5分
        space: {type: Number, desc: '空间'},
        power: {type: Number, desc: '动力'},
        operation: {type: Number, desc: '操控'},
        fuelConsumption: {type: Number, desc: '油耗'},
        comfort: {type: Number, desc: '舒适性'},
        appearance: {type: Number, desc: '外观'},
        interior: {type: Number, desc: '内饰'},
        costPerformance: {type: Number, desc: '性价比'}
    },
    purpose: [{type: String, desc: '购车目的'}],
    images: [{type: String, desc: '图片URL'}],
    content: Schema.Types.Mixed, //eg: {'操控': '很好!!!!!'}
    views: {type: Number, desc: '多少人看过'},
    support: {type: Number, desc: '多少人支持'}
}, {
    collection: 'publicPraises', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = publicPraiseSchema;
