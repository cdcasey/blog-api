const express = require('express');
const PORT = process.env.PORT || 8000;

const server = express();

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

server.use('/', (req, res) => {
    res.json({ message: 'hello world' });
});

module.exports = server;
