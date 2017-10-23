const UserModel = require(_base + 'models/User');

class User {
    constructor() {
    }

    async getById (userId) {
        let userModel = new UserModel({
            userId: userId
        });

        return await userModel.save();
    }
}

module.exports = User;
