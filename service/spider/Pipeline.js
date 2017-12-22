/*
    将数据持久化
*/

class Pipeline {
    constructor () {

    }

    async saveOne (opts) {
        let docs = await this.save(opts);
        return docs[0];
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

        if(!Array.isArray(data)) {
            data = [data];
        }

        return data.map(async function(item) {
            let model = new Model(item);
            return await model.save();
        });
    }

    /**
     * 从DB中查询数据
     * @param opts
     * @returns {Promise.<void>}
     */
    async findOneDoc (opts) {
        let modelName = opts.modelName;
        let where = opts.where;

        let docs = await this.findDocs(opts);
        return docs && docs[0];
    }

    //TODO， 加入limit, offset等
    async findDocs (opts) {
        let modelName = opts.modelName;
        let where = opts.where;
        let limit = opts.limit;
        let offset = opts.offset;
        let sort = opts.sort;

        let Model = require(_base + `models/${modelName}`);

        let query = Model.find(where);
        if(limit) {
            query.limit(limit);
        }
        if(offset) {
            query.offset(offset);
        }
        if(sort) {
            query.sort(sort);
        }

        return await query.exec();
    }

    async updateOneDoc (opts) {
        let modelName = opts.modelName;
        let where = opts.where;
        let model = opts.model;

        let Model = require(_base + `models/${modelName}`);
        return await Model.findAndModify(where, model);
    }

    async updateDocs (opts) {
        let modelName = opts.modelName;
        let where = opts.where;
        let model = opts.model;

        let Model = require(_base + `models/${modelName}`);
        return await Model.update(where, model, {multi: true});
    }

    async count (opts) {
        let modelName = opts.modelName;
        let where = opts.where;

        let Model = require(_base + `models/${modelName}`);

        return await Model.count(where);
    }
}

module.exports = Pipeline;
