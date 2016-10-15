import { expect } from 'chai';
import request from 'supertest';

import { getRepositories } from '../spec-helper';
import { messageRepositoryStub } from '../stub';
import { application } from '../../src/';
import * as service from '../../src/services/message';
import { default as env } from '../../config/env';

describe('message api', () => {
  let app;
  let messages;

  before(async function () {
    const repositories = getRepositories();
    env.accessKey = '123';
    app = await application({ env, repositories });

    messages = await service.list(repositories, {});
  });

  describe('list', () => {
    it('should list messages', (done) => {
      request(app)
        .get('/api/messages')
        .set('x-client-id', '123')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.be.instanceof(Array);
          res.body
            .forEach(message => {
              expect(message).to.have.property('id');
              expect(message).to.have.property('name');
              expect(message).to.have.property('email');
              expect(message).to.have.property('subject');
              expect(message).to.have.property('content');
              expect(message).to.have.property('createdAt');
              expect(message).to.not.have.property('updatedAt');
              expect(message).to.not.have.property('active');
            });
          done();
        });
    });
  });

  describe('detail', () => {
    it('should throw message not found', function (done) {
      request(app)
        .get('/api/messages/123456')
        .set('x-client-id', '123')
        .expect(404)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('error_name');
          expect(res.body).to.have.property('error_message');
          expect(res.body).to.have.property('status_code');
          expect(res.body.error_name).to.be.equal('NotFoundError');
          expect(res.body.error_message).to.be.equal('Could not find message.');
          expect(res.body.status_code).to.be.equal(404);
          done();
        });
    });

    it('should detail message', function (done) {
      request(app)
        .get(`/api/messages/${messages[0]._id}`)
        .set('x-client-id', '123')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('subject');
          expect(res.body).to.have.property('content');
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.not.have.property('updatedAt');
          expect(res.body).to.not.have.property('active');
          done();
        });
    });
  });

  describe('create', () => {
    it('should throw error when sending invalid request body', (done) => {
      request(app)
        .post('/api/messages')
        .set('x-client-id', '123')
        .send({
          name: '',
          email: 'chuck@norris.com',
          subject: 'Chuck',
          content: 'Chuck Norris needs no further explanation.',
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('error_name');
          expect(res.body).to.have.property('error_message');
          expect(res.body).to.have.property('status_code');
          expect(res.body.error_name).to.be.equal('BadRequestError');
          expect(res.body.error_message).to.be.equal('Please inform your name.');
          expect(res.body.status_code).to.be.equal(400);
          done();
        });
    });

    it('should create message', (done) => {
      request(app)
        .post('/api/messages')
        .set('x-client-id', '123')
        .send({
          name: 'Chuck Norris',
          email: 'chuck@norris.com',
          subject: 'Chuck',
          content: 'Chuck Norris needs no further explanation.',
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('subject');
          expect(res.body).to.have.property('content');
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.not.have.property('updatedAt');
          expect(res.body).to.not.have.property('active');
          done();
        });
    });
  });

  describe('update', () => {
    it('should throw message not found', (done) => {
      request(app)
        .put('/api/messages/123456')
        .send({
          name: 'Bugs Bunny',
          email: 'bugs@bunny.com',
          subject: 'What\'s up, Doc!',
          content: 'Oh, well... it\'s five o\' clock somewhere.',
        })
        .set('x-client-id', '123')
        .expect(404)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('error_name');
          expect(res.body).to.have.property('error_message');
          expect(res.body).to.have.property('status_code');
          expect(res.body.error_name).to.be.equal('NotFoundError');
          expect(res.body.error_message).to.be.equal('Could not find message.');
          expect(res.body.status_code).to.be.equal(404);
          done();
        });
    });

    it('should throw error when sending invalid request body', function (done) {
      request(app)
        .put(`/api/messages/${messages[0]._id}`)
        .send({
          name: '',
          email: 'bugs@bunny.com',
          subject: 'What\'s up, Doc!',
          content: 'Oh, well... it\'s five o\' clock somewhere.',
        })
        .set('x-client-id', '123')
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('error_name');
          expect(res.body).to.have.property('error_message');
          expect(res.body).to.have.property('status_code');
          expect(res.body.error_name).to.be.equal('BadRequestError');
          expect(res.body.error_message).to.be.equal('Please inform your name.');
          expect(res.body.status_code).to.be.equal(400);
          done();
        });
    });

    it('should update message', function (done) {
      request(app)
        .put(`/api/messages/${messages[0]._id}`)
        .send({
          name: 'Bugs Bunny',
          email: 'bugs@bunny.com',
          subject: 'What\'s up, Doc!',
          content: 'Oh, well... it\'s five o\' clock somewhere.',
        })
        .set('x-client-id', '123')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('subject');
          expect(res.body).to.have.property('content');
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.not.have.property('updatedAt');
          expect(res.body).to.not.have.property('active');
          expect(res.body.id).to.be.equal(messages[0]._id.toString());
          expect(res.body.name).to.be.equal('Bugs Bunny');
          expect(res.body.email).to.be.equal('bugs@bunny.com');
          expect(res.body.subject).to.be.equal('What\'s up, Doc!');
          expect(res.body.content).to.be.equal('Oh, well... it\'s five o\' clock somewhere.');
          done();
        });
    });
  });

  describe('delete', () => {
    it('should throw message not found', (done) => {
      request(app)
        .del('/api/messages/123456')
        .set('x-client-id', '123')
        .expect(404)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body).to.have.property('error_name');
          expect(res.body).to.have.property('error_message');
          expect(res.body).to.have.property('status_code');
          expect(res.body.error_name).to.be.equal('NotFoundError');
          expect(res.body.error_message).to.be.equal('Could not find message.');
          expect(res.body.status_code).to.be.equal(404);
          done();
        });
    });

    it('should delete message', function (done) {
      request(app)
        .del(`/api/messages/${messages[0]._id}`)
        .set('x-client-id', '123')
        .expect(204)
        .end(done);
    });
  });
});
