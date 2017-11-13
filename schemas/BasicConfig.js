/**
 * 基础的参数配置
 */
const Schema = require('mongoose').Schema;

const basicSchema = new Schema({
    seriesId: {type: String, desc: '系列ID'},
    manufacturer: {type: String, desc: '厂商'},
    level: {type: String, desc: '级别'},
    timeToMarket: {type: Date, desc: '上市时间'},
    maxSpeed: {type: Number, desc: '最高时速，单位：km/h'},
    officalTimeSpeedTo100: {type: Number, desc: '官方0-100km/h加速(s)'},
    actualTimeSpeedTo100: {type: Number, desc: '实测0-100km/h加速(s)'},
    actualMeterBrakeTo0: {type: Number, desc: '实测100-0km/h制动(m)'},
    actualFuelConsumption: {type: Number, desc: '实测油耗(L/100km)'},
    MIITFuelConsumption: {type: Number, desc: '工信部综合油耗(L/100km)'},
    actualGroundClearance: {type: Number, desc: '实测离地间隙(mm)'},
    wholeCarQATime: {type: Number, desc: '整车质保'},
}, {
    collection: 'basics', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = basicSchema;