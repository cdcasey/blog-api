const express = require('express');
const PORT = process.env.PORT || 8000;

const server = express();
const knex = require('./db/knex');

server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

server.get('/posts', (req, res, next) => {
    const posts = knex('posts')
        .orderBy('id')
        .then((posts) => {
            res.json(posts);
        })
        .catch(next);
});

server.use('/', (req, res) => {
    res.json({ message: 'hello world' });
});

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
