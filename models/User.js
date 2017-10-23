const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {type: Number},
    firstname: {type: String},
    lastname: {type: String},
    age: {type: Number},
    isMember: {type: Boolean},
    address: {type: Schema.Types.Mixed},
    funcs: [{type: Schema.Types.Mixed}]
}, {
    // autoIndex: false, //自动建立索引，每次程序启动时，建立一次索引。所以，dev环境打开，product环境关闭
    collection: 'users', //默认取model name的负数为collection name，该选项用于手动指定collection name
    minimize: _config.get('mongodb.schemaOpts.minimize'), //默认不会将空对象"{}"写入db。置为false，将空对象写入db
    versionKey: _config.get('mongodb.schemaOpts.versionKey'), //每更新一次，则会更新versionKey。若做数据跟踪，则可以置为true。
    timestamps: _config.get('mongodb.schemaOpts.timestamps') //设置createdAt和updatedAt
});

//建立索引，也可以放在程序外部建立
userSchema.index({userId: 1});

/**
 * 实例方法，定义在Schema实例之上
 * 调用方法：
 *    let user = new UserModel();
 *    user.getFullName(cb);
 * @type {Function}
 */
userSchema.methods.getFullName = function (cb) {
    cb(this.firstname + ' ' + this.lastname);
};


/**
 * 静态方法是定义在Schema实例之上
 * 注意：静态方法的定义，不能使用箭头函数(=>)，因为this会绑定不正确
 * @param userId
 * @param cb
 * @returns {*|Query|T}
 */
userSchema.statics.findByUserId = function (userId, cb) {
    return this.find({userId: userId}, cb);
};

/**
 * 是mongoose query方法的一种扩展。
 * 调用方法：
 *  UserModel.find().byName('Mike').exec(cb);
 *
 * @param name
 * @returns {*|Query|T}
 */
userSchema.query.byName = function(name) {
    return this.find({name: name});
};

/**
 * 虚拟属性不会写入到db中
 * 调用方式
 *   let user = new UserModel();
 *   console.log(user.fullName);
 */
userSchema.virtual('fullName').get(function() {
    return this.firstname + ' ' + this.lastname;
});


/**
 * 默认会自动校验document格式，将validateBeforeSave置为false，则不会校验。
 */
userSchema.set('validateBeforeSave', false);

/**
 * 手动设置firstname的校验方法。
 * 调用方法：
 *    let user = new UserModel();
 *    user.validate(function(error) {
 *      //error不为空，则表示校验不过
 *    });
 */
userSchema.path('firstname').validate(function (value) {
    //此处校验firstname
    //return true，校验通过
    //return false，校验不过
});

module.exports = mongoose.model('User', userSchema);
