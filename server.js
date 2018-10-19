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

server.get('/posts/:id', (req, res, next) => {
    const post = knex('posts')
        .where('id', req.params.id)
        .first()
        .then((post) => {
            if (typeof post === 'undefined') {
                res.status(404).json({
                    message: `Post ${req.params.id} does not exist`
                });
            } else {
                res.json(post);
            }
        })
        .catch(next);
});

server.delete('/posts/:id', (req, res, next) => {
    const post = knex('posts')
        .del('id', req.params.id)
        .then((data) => {
            if (typeof data[0] === 'undefined') {
                res.status(404).json({
                    message: `Post ${req.params.id} does not exist`
                });
            } else {
                res.json({ message: `Deleted ${data[0]} row(s)` });
            }
        })
        .catch((err) => {
            next(err);
        });
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
