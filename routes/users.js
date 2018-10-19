'use strict';

const express = require('express');
const router = express.Router();

const usersModel = require('../models/users');
const usersDB = new usersModel('users');

router.get('/', (req, res, next) => {
    usersDB
        .all()
        .then((users) => {
            res.json(users);
        })
        .catch(next);
});

module.exports = router;
