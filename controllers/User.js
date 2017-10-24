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
}

module.exports = User;
