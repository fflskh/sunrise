/**
 * 车身参数配置
 */
const Schema = require('mongoose').Schema;

const bodySchema = new Schema({
    seriesId: {type: String, desc: '系列ID'},
    length: {type: Number, desc: '长度'},
    width: {type: Number, desc: '宽度'},
    height: {type: Number, desc: '高度'},
    wheelbase: {type: Number, desc: '轴距'},
    frontTrack: {type: Number, desc: '前轮距'},
    backTrack: {type: Number, desc: '后轮距'},
    minGroundClearance: {type: Number, desc: '最小离地间隙'},
    weight: {type: Number, desc: '整备质量'},
    structure: {type: String, desc: '车身结构'},
    doorCount: {type: Number, desc: '车门数(个)'},
    seatCount: {type: Number, desc: '座位数(个)'},
    fuelTankCapacity: {type: Number, desc: '油箱容积(L)'},
    trunkCapacity: {type: Number, desc: '行李厢容积(L)'},
}, {
    collection: 'bodies', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = bodySchema;