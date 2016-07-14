import { expect } from 'chai';
import request from 'supertest';

import { getRepositories } from '../spec-helper';
import messageFixture from '../fixtures/message';
import Mongo from '../repository/mockMongo';
import { application } from '../../src/';
import * as service from '../../src/services/message';
import { config as env } from '../../config/env';

const mongo = new Mongo();

describe('message api', () => {
  let app;

  before(async function () {
    env.accessKey = '123';

    app = await application({ env, mongo });

    for (const message of messageFixture) {
      await service.create(getRepositories(mongo), message);
    }
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

          expect(res.body).to.have.length(5);
          expect(res.body[0]).to.not.have.property('updatedAt');
          expect(res.body[0]).to.not.have.property('active');
          done();
        });
    });
  });

  describe('detail', () => {
    it('should throw message not found', async function (done) {
      const messages = await service.list(getRepositories(mongo));

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

    it('should detail message', async function (done) {
      const messages = await service.list(getRepositories(mongo));

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

    it('should throw error when sending invalid request body', async function (done) {
      const messages = await service.list(getRepositories(mongo));

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

    it('should update message', async function (done) {
      const messages = await service.list(getRepositories(mongo));

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
          expect(res.body.id).to.be.equal(messages[0]._id);
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

    it('should delete message', async function (done) {
      const messages = await service.list(getRepositories(mongo));

      request(app)
        .del(`/api/messages/${messages[0]._id}`)
        .set('x-client-id', '123')
        .expect(200)
        .end(done);
    });
  });
});
