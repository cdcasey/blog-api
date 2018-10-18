'use strict';

process.env.PORT = 8888;
process.env.NODE_ENV = 'test';
const server = require('../server');
const request = require('supertest')(server);
const expect = require('chai').expect;

const knex = require('../db/knex');

before((done) => {
    knex.migrate.rollback().then(() => {
        knex.migrate.latest().then(() => {
            return knex.seed
                .run()
                .then(() => done())
                .catch((err) => done(err));
        });
    });
});

after((done) => {
    knex.migrate
        .rollback()
        .then(() => done())
        .catch((err) => done(err));
});

describe('GET /posts', () => {
    it('should return a list of posts', (done) => {
        request
            .get('/posts')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.text).to.include('"title":"post title"');
                done(err);
            });
    });
});
