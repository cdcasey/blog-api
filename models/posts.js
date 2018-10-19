'use strict';

const DBModel = require('./dbmodel');

class Posts extends DBModel {
    constructor(table) {
        super(table);
    }
}

module.exports = Posts;
