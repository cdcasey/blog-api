'use strict';

const SECRET = process.env.SECRET || 'secretkey';
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
    let authMethod, error;
    if (req.body.email) {
        authMethod = userDB.getByEmail(req.body.email);
        error = 'Email not found';
    } else {
        authMethod = userDB.getByUsername(req.body.username);
        error = 'User not found';
    }
    authMethod.then((user) => {
        if (!user) {
            res.status(400).send({ message: error });
        } else {
            bcrypt
                .compare(req.body.password, user.password)
                .then((success) => {
                    if (success) {
                        jwt.sign({ id: user.id }, SECRET, (err, token) => {
                            res.cookie('suid', token, { httpOnly: true });
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
