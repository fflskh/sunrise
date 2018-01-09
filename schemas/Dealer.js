/**
 * 经销商
 */
const Schema = require('mongoose').Schema;

const DealerSchema = new Schema({
    seriesIds: [{type: Number, desc: '车系列'}],
    cityid: {type: Number, desc: '城市ID'},
    baidulat: {type: Number, desc: '纬度'},
    baidulon: {type: Number, desc: '经度'},
    address:{type: String, desc: '地址'},
    businessLicense: {type: String, desc: '营业执照'},
    linkman: {type: String, desc: '联系人'},
    mobile: {type: String, desc: '电话'},
    name: {type: String, desc: '经销商名称'},
    owner: {type: String, desc: '经销商拥有者'},
    originalId: {type: Number, desc: '原始ID'},
    ontop: {type: Number, desc: ''},
    ontoptime: {type: Schema.Types.Mixed, desc: ''},
    provinceid: {type: Number, desc: '省份ID'},
    shortname: {type: String, desc: '简称'},
    status: {type: Number, desc: '状态'},
}, {
    collection: 'dealers', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = DealerSchema;
