const express = require('express');
const PORT = process.env.PORT || 8000;

const server = express();

server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

server.get('/posts', (req, res) => {
    res.json([
        { id: 289991, title: 'dddeee', categories: 'asdasd', content: 'aafh' },
        {
            id: 289989,
            title: '4 poster',
            categories: 'so mayny, categories',
            content: 'Hello worls'
        },
        {
            id: 289926,
            title: 'Vue 2.0 Hello World',
            categories: 'sdsadssad',
            content: 'dasd'
        },
        {
            id: 288695,
            title: 'First Post',
            categories: 'dumb',
            content: 'This is a dumb post'
        }
    ]);
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
