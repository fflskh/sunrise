/**
 * 发动机详细的参数配置
 */
const Schema = require('mongoose').Schema;

const engineSchema = new Schema({
    seriesId: {type: String, desc: '系列ID'},
    model: {type: String, desc: '发动机型号'},
    year: {type: Number, desc: '年份'},
    displacement: {type: String, desc: '排量'},
    cylinderVolume: {type: String, desc: '汽缸容积，单位cc'},
    workType: {type: String, desc: '工作方式：涡轮增压，自然吸气等'},
    cylinderArrange: {type: String, desc: '汽缸排列形式'},
    cylinderAmount: {type: String, desc: '汽缸个数'},
    cylinderValveAmount: {type: String, desc: '每缸气门数'},
    valvStructure: {type: String, desc: '气门结构'},
    cylinderDiameter: {type: String, desc: '缸径'},
    strokes: {type: String, desc: '冲程'},
    maxHorsepower: {type: String, desc: '最大马力'},
    maxPower: {type: String, desc: '最大功率'},
    maxPowerRotationalSpeed: {type: String, desc: '最大功率转速'},
    maxTorque: {type: String, desc: '最大扭矩'},
    maxTorqueSpeed: {type: String, desc: '最大扭矩转速'},
    specialSkill: {type: String, desc: '发动机特有技术'},
    fuel: {type: String, desc: '燃料形式'},
    fuelNo: {type: String, desc: '燃油标号'},
    fuelSupplyMode: {type: String, desc: '供油方式'},
    cylinderHeadMaterial: {type: String, desc: '缸盖材料'},
    cylinderBodyMaterial: {type: String, desc: '缸体材料'},
    EnvStandard: {type: String, desc: '环保标准'}
}, {
    collection: 'engines', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = engineSchema;
