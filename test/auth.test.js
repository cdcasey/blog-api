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

describe('POST /auth', () => {
    it('should get a token with valid credentials', (done) => {
        request
            .post('/auth')
            .send({
                email: 'cdcasey+git@gmail.com',
                password: 'chris'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.text).to.include('"token":');
                done(err);
            });
    });

    it('should fail with an invalid email', (done) => {
        request
            .post('/auth')
            .send({
                email: 'cdcasey@gmail.com',
                password: 'chris'
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                expect(res.text).to.equal('{"message":"Email not found"}');
                done(err);
            });
    });

    it('should fail with an invalid password', (done) => {
        request
            .post('/auth')
            .send({
                email: 'cdcasey+git@gmail.com',
                password: 'christopher'
            })
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                expect(res.text).to.equal('{"message":"Bad Password"}');
                done(err);
            });
    });
});
