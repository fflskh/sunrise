class User {
    constructor() {
    }

    async getById (userId) {
        let user = await new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve({
                    id: userId,
                    name: 'master',
                    role: 'admin'
                });
            }, 1000);
        });

        return user;
    }
}

module.exports = User;
