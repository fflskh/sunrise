const UserModel = require(_base + 'models/User');

class User {
    constructor() {
    }

    async createUser (opts) {
        let userId = opts.userId;
        let firstname = opts.firstname;
        let lastname = opts.lastname;
        let age = opts.age;
        let isMember = opts.isMember;
        let address = opts.address;

        let userModel = new UserModel({
            userId,
            firstname,
            lastname,
            age,
            isMember,
            address
        });

        return await userModel.save();
    }

    async getByUserId (userId) {
        return await new Promise((resolve, reject) => {
            UserModel.findOne({userId: userId}, function (error, results) {
                if(error) {
                    return reject(error);
                }

                resolve(results);
            });
        });
    }
}

module.exports = User;
