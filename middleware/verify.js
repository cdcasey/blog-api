'use strict';

const SECRET = process.env.SECRET || 'secretkey';
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    let bearerToken;

    // Token can come through either as an authorization header or as a cookie
    if (typeof bearerHeader !== 'undefined') {
        bearerToken = bearerHeader.split(' ')[1];
    } else if (req.cookies['suid']) {
        bearerToken = req.cookies['suid'];
    } else {
        res.status(403).json({ message: 'please log in' });
        return;
    }

    jwt.verify(bearerToken, SECRET, (error, authData) => {
        if (error) {
            res.status(403).json({ message: 'Invalid token' });
            return;
        } else {
            req.authData = authData;
            next();
        }
    });
}

module.exports = verifyToken;
