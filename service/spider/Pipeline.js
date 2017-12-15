/*
    将数据持久化
*/

class Pipeline {
    constructor () {

    }

    /**
     *
     * @param opts
     * Model - 通过Model来保存数据
     * data - 需要保存的数据
     * @returns {Promise.<Promise|*|Job>}
     */
    //TODO,需要批量插入，同时需要满足schema校验
    async save (opts) {
        let modelName = opts.modelName;
        let data = opts.data;

        let Model = require(_base + `models/${modelName}`);
        let model = new Model(data);

        if(Array.isArray(data)) {
            return data.map(async function(item) {
                return await model.save(item);
            });
            // await new Promise((resovle, reject) => {
            //     Model.collection.insert(data, function(error, docs) {
            //         if(error) {
            //             return reject(error);
            //         }
            //         resovle(docs);
            //     });
            // })
        } else {
            return await model.save(data);
        }
    }
}

module.exports = Pipeline;
