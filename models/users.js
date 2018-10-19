'use strict';

const knex = require('../db/knex');
const DBModel = require('./dbmodel');

class Users extends DBModel {
    constructor(table) {
        super(table);
    }

    getByEmail(email) {
        return knex(this.table)
            .where('email', email)
            .first();
    }

    getByUsername(username) {
        return knex(this.table)
            .where('username', username)
            .first();
    }
}

module.exports = Users;
