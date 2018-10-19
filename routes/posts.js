const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

router.get('/', (req, res, next) => {
    const posts = knex('posts')
        .orderBy('id')
        .then((posts) => {
            res.json(posts);
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
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

router.post('', (req, res, next) => {
    const post = knex('posts')
        .returning('*')
        .insert(req.body)
        .then((data) => {
            res.status(201).json({ inserted: data });
        })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    const post = knex('posts')
        .where('id', req.params.id)
        .del()
        .then((data) => {
            if (data === 1) {
                res.json({ message: `Deleted 1 row` });
            } else {
                res.status(404).json({
                    message: `Post ${req.params.id} does not exist`
                });
            }
        })
        .catch(next);
});

module.exports = router;
