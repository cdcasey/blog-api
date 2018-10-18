bcryptSync = require('bcrypt');

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([
                {
                    username: 'chris',
                    email: 'cdcasey+git@gmail.com',
                    password: bcryptSync.hashSync('chris', 10)
                }
            ]);
        });
};
