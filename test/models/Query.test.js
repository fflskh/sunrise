
require('../../lib/init');
const mocha = require('mocha');
const should = require('should');
const Spider = require(_base + 'service/laosiji/Spider');
const middleware = require(_base + 'middleware');

let data = [
    {
        key: '价格',
        values: ['不限',
            '5万以内',
            '5-10万',
            '10-15万',
            '15-20万',
            '20-30万',
            '30-40万',
            '40-50万',
            '50-70万',
            '70-100万',
            '100万以上']
    },
    {
        key: '级别',
        values: ['不限', '轿车', 'SUV', 'MPV', '跑车', '微面', '轻客', '卡车']
    },
    {
        key: '车身结构',
        values: ['不限', '两厢', '三厢', '掀背', '旅行车', '硬顶敞篷', '软顶敞篷', '硬顶跑车']
    },
    {
        key: '排量',
        values: ['不限',
            '1.0L以下',
            '1.1L-1.6L',
            '1.7L-2.0L',
            '2.1L-2.5L',
            '2.6L-3.0L',
            '3.1L-4.0L',
            '4.0L以上']
    },
    {
        key: '国别',
        values: ['不限', '中国', '德国', '日本', '美国', '韩国', '法国', '英国', '其它']
    },
    {
        key: '能源',
        values: ['不限', '汽油', '柴油', '纯电动', '油电混合', '插电式混动', '增程式']
    },
    {key: '变速箱', values: ['不限', '手动', '自动']},
    {
        key: '座位数',
        values: ['不限', '2座', '4座', '5座', '6座', '7座', '7座以上']
    },
    {key: '生产厂商', values: ['不限', '自主', '合资', '进口']},
    {key: '进气方式', values: ['不限', '自然吸气', '涡轮增压', '机械增压']},
    {key: '驱动方式', values: ['不限', '前驱', '后驱', '四驱']},
    {
        key: '气缸数',
        values: ['不限', '3缸', '4缸', '5缸', '6缸', '8缸及以上']
    },
    {key: '配置', values: ['不限']}
];

describe('Spider ',function() {
    before(function (done) {
        middleware.mongoConnector(_config.get('mongodb'))({}, function(error) {
            done(error);
        });
    });

    after(function (done) {
        done();
    });

    describe(' Query model.save ', function () {
        it('should be ok', function(done) {
            let Model = require(_base+'models/Query');
            data.map(async function(item) {
                let model = new Model(item);
                return await model.save();
            });
        })
    });
});
