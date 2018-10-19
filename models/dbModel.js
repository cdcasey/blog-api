'use strict';

const knex = require('../db/knex');
const bcrypt = require('bcrypt');

class DBModel {
    constructor(table) {
        this.table = table;
    }

    all() {
        return knex(this.table).orderBy('id');
    }

    getById(id) {
        return knex(this.table)
            .where('id', id)
            .first();
    }

    create(data) {
        data = this.validateData(data);
        return knex(this.table)
            .insert(data)
            .returning('*');
    }

    update(id, data) {
        data = this.validateData(data);
        return this.getById(id).update(data);
    }

    delete(id) {
        return this.getById(id).delete();
    }

    validateData(data) {
        const validData = {};
        for (const key in data) {
            if (data[key]) {
                validData[key] = data[key];
            }
            if (key === 'password') {
                validData[key] = bcrypt.hashSync(validData[key], 10);
            }
        }
        return validData;
    }
}

module.exports = DBModel;
