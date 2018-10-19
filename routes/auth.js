'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/users');
const userDB = new userModel('users');

// router.get('/logout', (req, res) => {
//     req.cookie = null;
// });

router.post('/', (req, res, next) => {
    userDB.getByEmail(req.body.email).then((user) => {
        if (!user) {
            res.status(400).send({ message: 'Email not found' });
        } else {
            bcrypt
                .compare(req.body.password, user.password)
                .then((success) => {
                    if (success) {
                        jwt.sign({ id: user.id }, 'secretkey', (err, token) => {
                            res.cookie('suid', token);
                            res.json({
                                token
                            });
                        });
                    } else {
                        res.status(401).json({ message: 'Bad Password' });
                    }
                })
                .catch((err) => {
                    next(err);
                });
        }
    });
});

module.exports = router;
