const express = require('express');
const PORT = process.env.PORT || 8000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middleware/verify');

const server = express();

server.use(
    morgan('common', {
        skip: function(req, res) {
            return process.env.NODE_ENV === 'test';
        }
    })
);

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.disable('x-powered-by');

server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

const posts = require('./routes/posts');
const users = require('./routes/users');
const auth = require('./routes/auth');

server.use('/posts', verifyToken, posts);
server.use('/users', users);
server.use('/auth', auth);

/*
server.use('/', (req, res) => {
    res.json({ message: 'hello world' });
});
*/

server.use((req, res) => {
    res.status(404).send('Not Found');
});

server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

module.exports = server;
