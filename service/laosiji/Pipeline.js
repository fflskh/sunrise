const SuperPipeline = require('../spider/Pipeline');

class Pipeline extends SuperPipeline {
    constructor() {
        super();
    }

    async upsertDealers (opts) {
        let self = this;
        let models = opts.models;

        return await _utils.parallel(models, 10, async function (model) {
            let dealer = await self.findOneDoc({
                modelName: 'Dealer',
                where: {originalId: model.originalId}
            });

            if(!dealer) {
                return await self.saveOne({
                    modelName: 'Dealer',
                    data: model
                });
            }

            let seriesIds = _.uniq(dealer.seriesIds.concat(model.seriesIds));
            return await self.updateOneDoc({
                modelName: 'Dealer',
                where: {originalId: model.originalId},
                model: seriesIds
            });
        });
    }
}

module.exports = Pipeline;
