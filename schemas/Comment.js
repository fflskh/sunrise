/**
 * 评论，针对口碑的评论
 */
const Schema = require('mongoose').Schema;

const commentSchema = new Schema({
    publicPraiseId: {type: Number, desc: '口碑ID'},
    commentId: {type: Number, desc: '评论别人的评论，若没有则为空'},
    userName: {type: String, desc: '用户名'},
    content: {type: String, desc: '评论内容'}
}, {
    collection: 'comments', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

module.exports = commentSchema;
