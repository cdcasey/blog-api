'use strict';

process.env.PORT = 8888;
process.env.NODE_ENV = 'test';
const server = require('../server');
const request = require('supertest')(server);
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

const knex = require('../db/knex');

let token, badToken;

before((done) => {
    token = jwt.sign({ id: 1 }, 'secretkey');
    badToken = jwt.sign({ id: 1 }, 'NOTsecretkey');
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
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.text).to.include('"title":"post title"');
                done(err);
            });
    });

    it('should fail with a bad token', (done) => {
        request
            .get('/posts')
            .set('Authorization', `Bearer ${badToken}`)
            .expect('Content-Type', /json/)
            .expect(403)
            .end((err, res) => {
                expect(res.text).to.equal('{"message":"Invalid token"}');
                done(err);
            });
    });

    it('should fail with no token', (done) => {
        request
            .get('/posts')
            .expect('Content-Type', /json/)
            .expect(403)
            .end((err, res) => {
                expect(res.text).to.equal('{"message":"please log in"}');
                done(err);
            });
    });
});

describe('GET /posts/:id', () => {
    it('should get a post by id', (done) => {
        request
            .get('/posts/1')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.text).to.include('"title":"post title"');
                done(err);
            });
    });

    it('should return an error if the post does not exist', (done) => {
        request
            .get('/posts/2')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                expect(res.body).to.deep.equal({
                    message: 'Post 2 does not exist'
                });
                done(err);
            });
    });
});

describe('POST /posts', () => {
    it('should create a new post', (done) => {
        request
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'second post',
                categories: 'category',
                content: 'some content'
            })
            .expect(201)
            .end((err, res) => {
                expect(res.text).to.include('"title":"second post"');
                // expect(res.body.inserted[0].title).to.equal('second post');
                done(err);
            });
    });
});

describe('DELETE /posts/:id', () => {
    it('should delete a post by id', (done) => {
        request
            .delete('/posts/1')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.deep.equal({ message: 'Deleted 1 row' });
                done(err);
            });
    });

    it('should return an error if the post does not exist', (done) => {
        request
            .delete('/posts/1')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                expect(res.body).to.deep.equal({
                    message: 'Post 1 does not exist'
                });
                done(err);
            });
    });
});
