const Base = require('./Base');
const QueryModel = require(_base + 'models/Query');

class Query extends Base {
    constructor(context) {
        super(context);
    }

    /**
     *
     * @param model
     *  queryKey - String
     *  queryOptions - Array
     * @returns {Promise.<Job|*>}
     */
    async saveData (model) {
        this.logger.info('create new query data : ', model);
        let queryModel = new QueryModel(model);

        return await queryModel.save();
    }

    //TODO，批量查询，待改进
    async saveDatas (models) {
        let self = this;
        return await models.map(async function(model) {
            return self.createQuery(model);
        })
    }
}

module.exports = Query;
