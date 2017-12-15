const Base = require('./Base');
const UserModel = require(_base + 'models/User');

class User extends Base {
    constructor(context) {
        super(context);
    }

    async createUser (opts) {
        let userId = opts.userId;
        let firstname = opts.firstname;
        let lastname = opts.lastname;
        let age = opts.age;
        let isMember = opts.isMember;
        let address = opts.address;
        let userData = {
            userId,
            firstname,
            lastname,
            age,
            isMember,
            address
        };

        this.logger.info('create new user data : ', userData);
        let userModel = new UserModel(userData);

        return await userModel.save();
        // return await new Promise((resolve, reject) => {
        //     UserModel.collection.insert([userData, userData], function(error, docs) {
        //         if(error) {
        //             return reject(error);
        //         }
        //
        //         return resolve(docs);
        //     })
        // })
    }

    async getByUserId (userId) {
        //mongoose的queries返回的不是标准的promise，但是可以用await获取值
        //exec()函数返回的才是标准的promise
        return await UserModel.findOne({userId: userId}).exec();
    }
}

module.exports = User;
