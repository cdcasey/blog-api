'use strict';

const express = require('express');
const router = express.Router();

const postsModel = require('../models/posts');
const postsDB = new postsModel('posts');

router.get('/', (req, res, next) => {
    postsDB
        .all()
        .then((posts) => {
            res.json(posts);
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    postsDB
        .getById(req.params.id)
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
    postsDB
        .create(req.body)
        .then((data) => {
            res.status(201).json({ inserted: data });
        })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    postsDB
        .delete(req.params.id)
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
