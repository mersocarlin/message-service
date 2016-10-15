import { expect } from 'chai';
import * as service from '../../src/services/message';
import { createBigString, getRepositories } from '../spec-helper';
import { messageRepositoryStub } from '../stub';


describe('message-service', () => {
  let repositories;
  let messages;

  before(async function () {
    repositories = getRepositories();
    messages = await service.list(repositories, {});
  });

  describe('create', () => {
    it('should create message', async function () {
      const data = {
        name: 'John Doe',
        email: 'john@doe.com',
        subject: 'Hey you!',
        content: 'I\'m sending a new message.',
      };

      const message = await service.create(repositories, data);
      expect(message).to.have.property('_id');
      expect(message).to.have.property('createdAt');
      expect(message).to.have.property('updatedAt');
      expect(message).to.have.property('active', true);
      expect(message).to.have.property('name', 'John Doe');
      expect(message).to.have.property('email', 'john@doe.com');
      expect(message).to.have.property('subject', 'Hey you!');
      expect(message).to.have.property('content', 'I\'m sending a new message.');
    });

    it('should create message with object containing extra properties', async function () {
      const data = {
        name: 'Jane Doe',
        email: 'jane@doe.com',
        subject: 'Contact form #2',
        content: 'Houston, we have a problem.',
        arg1: 1,
        arg2: true,
        arg3: 'arg3',
        arg4: new Date(),
      };

      const message = await service.create(repositories, data);
      expect(message).to.have.property('_id');
      expect(message).to.have.property('createdAt');
      expect(message).to.have.property('updatedAt');
      expect(message).to.have.property('active', true);
      expect(message).to.have.property('name', 'Jane Doe');
      expect(message).to.have.property('email', 'jane@doe.com');
      expect(message).to.have.property('subject', 'Contact form #2');
      expect(message).to.have.property('content', 'Houston, we have a problem.');
      expect(message).to.not.have.property('arg1');
      expect(message).to.not.have.property('arg2');
      expect(message).to.not.have.property('arg3');
      expect(message).to.not.have.property('arg4');
    });

    describe('validate', () => {
      it('should throw for message with missing properties', async function () {
        const data = {
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your name.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty name', async function () {
        const data = {
          name: '',
          email: 'mail@me.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your name.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty email', async function () {
        const data = {
          name: 'name',
          email: '',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your email.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with wrong email format', async function () {
        const data = {
          name: 'name',
          email: 'mail.me.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your email address seems to be invalid.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty subject', async function () {
        const data = {
          name: 'name',
          email: 'mail@me.com',
          subject: '',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your subject.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty content', async function () {
        const data = {
          name: 'name',
          email: 'mail@me.com',
          subject: 'subject',
          content: '',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your message.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big name string', async function () {
        const data = {
          name: createBigString(),
          email: 'john@doe.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big email string', async function () {
        const data = {
          name: 'John Doe',
          email: `${createBigString()}@doe.com`,
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big subject string', async function () {
        const data = {
          name: 'John Doe',
          email: 'john@doe.com',
          subject: createBigString(),
          content: 'content',
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big content string', async function () {
        const data = {
          name: 'John Doe',
          email: 'john@doe.com',
          subject: 'subject',
          content: createBigString(),
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });
    });
  });

  describe('update', () => {
    it('should update message', async function () {
      const createdMessage = await service.create(
        repositories,
        {
          name: 'say my name',
          email: 'say@myemail.com',
          subject: 'say my subject',
          content: 'say my message',
        }
      );
      const message = await service.update(repositories,
        {
          id: createdMessage._id,
          name: 'Frank Abagnale',
          email: 'frank@abagnale.com',
          subject: 'Greetings from...',
          content: 'My name is Frank Abagnale. Not Abagnalee not Abagnaylee but Abagnale!',
        }
      );

      expect(message).to.have.property('_id', createdMessage._id);
      expect(message).to.have.property('createdAt');
      expect(message).to.have.property('updatedAt');
      expect(message).to.have.property('active', true);
      expect(message).to.have.property('name', 'Frank Abagnale');
      expect(message).to.have.property('email', 'frank@abagnale.com');
      expect(message).to.have.property('subject', 'Greetings from...');
      expect(message).to.have.property('content', 'My name is Frank Abagnale. Not Abagnalee not Abagnaylee but Abagnale!');
      expect(message).to.not.have.property('arg1');
      expect(message).to.not.have.property('arg2');
      expect(message).to.not.have.property('arg3');
      expect(message).to.not.have.property('arg4');
    });

    it('should update message with object containing extra properties', async function () {
      const createdMessage = await service.create(
        repositories,
        {
          name: 'say my name',
          email: 'say@myemail.com',
          subject: 'say my subject',
          content: 'say my message',
        }
      );

      const message = await service.update(repositories,
        {
          id: createdMessage._id,
          name: 'Darth Vader',
          email: 'vader@sith.com',
          subject: 'I am your father',
          content: 'When I left you I was but the learner. Now I am the master.',
          arg1: 1,
          arg2: true,
          arg3: 'arg3',
          arg4: new Date(),
        }
      );

      expect(message).to.have.property('_id', createdMessage._id);
      expect(message).to.have.property('createdAt');
      expect(message).to.have.property('updatedAt');
      expect(message).to.have.property('active', true);
      expect(message).to.have.property('name', 'Darth Vader');
      expect(message).to.have.property('email', 'vader@sith.com');
      expect(message).to.have.property('subject', 'I am your father');
      expect(message).to.have.property('content', 'When I left you I was but the learner. Now I am the master.');
      expect(message).to.not.have.property('arg1');
      expect(message).to.not.have.property('arg2');
      expect(message).to.not.have.property('arg3');
      expect(message).to.not.have.property('arg4');
    });

    describe('validate', () => {
      it('should throw for message without id', async function () {
        let hasError = false;
        try {
          await service.update(repositories, {});
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('NotFoundError');
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message that does not exist', async function () {
        let hasError = false;
        try {
          await service.update(repositories,
            {
              id: 'abc123',
              name: 'new name',
              email: 'new@email.com',
              subject: 'new subject',
              content: 'new message',
            }
          );
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('NotFoundError');
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty name', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: '',
          email: 'mail@me.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your name.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty email', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: '',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your email.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with wrong email format', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: 'mail.me.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your email address seems to be invalid.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty subject', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: 'mail@me.com',
          subject: '',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your subject.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty content', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: 'mail@me.com',
          subject: 'subject',
          content: '',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your message.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big name string', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: createBigString(),
          email: 'john@doe.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big email string', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: 'John Doe',
          email: `${createBigString()}@doe.com`,
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big subject string', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: 'John Doe',
          email: 'john@doe.com',
          subject: createBigString(),
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big content string', async function () {
        const messages = await service.list(repositories);
        const data = {
          id: messages[0]._id,
          name: 'John Doe',
          email: 'john@doe.com',
          subject: 'subject',
          content: createBigString(),
        };

        let hasError = false;
        try {
          await service.create(repositories, data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });
    });
  });

  describe('list', () => {
    it('should list all messages', async function () {
      const messages = await service.list(repositories);

      expect(messages).to.be.instanceof(Array);
      messages
        .forEach(message => {
          expect(message).to.have.property('_id');
          expect(message).to.have.property('name');
          expect(message).to.have.property('email');
          expect(message).to.have.property('subject');
          expect(message).to.have.property('content');
          expect(message).to.have.property('active');
          expect(message).to.have.property('createdAt');
          expect(message).to.have.property('updatedAt');
        });
    });
  });

  describe('remove', () => {
    it('should delete message', async function () {
      const message = await service.create(repositories, {
        name: 'DELETED NAME',
        email: 'deleted@mail.com',
        subject: 'DELETED SUBJECT',
        content: 'DELETED MESSAGE',
      });

      await service.remove(repositories, message._id);
    });

    it('should ommit deleted message from list', async function () {
      const message = await service.create(repositories, {
        name: 'DELETED NAME',
        email: 'deleted@mail.com',
        subject: 'DELETED SUBJECT',
        content: 'DELETED MESSAGE',
      });

      const countBeforeRemove = await service.list(repositories, {});
      await service.remove(repositories, message._id);
      const countAfterRemove = await service.list(repositories, {});

      expect(countAfterRemove).to.have.lengthOf(countBeforeRemove.length - 1);
    });

    it('should not update deleted message', async function () {
      const message = await service.create(repositories, {
        name: 'DELETED NAME',
        email: 'deleted@mail.com',
        subject: 'DELETED SUBJECT',
        content: 'DELETED MESSAGE',
      });
      await service.remove(repositories, message._id);

      let hasError = false;
      try {
        await service.update(repositories, message);
      } catch (e) {
        hasError = true;
        expect(e.name).to.be.equal('NotFoundError');
      }
      expect(hasError).to.be.equal(true);
    });
  });

  describe('detail', () => {
    it('should detail message', async function () {
      const messages = await service.list(repositories);
      const message = await service.detail(repositories, messages[0]._id);

      expect(message).to.have.property('_id');
      expect(message).to.have.property('name');
      expect(message).to.have.property('email');
      expect(message).to.have.property('subject');
      expect(message).to.have.property('content');
      expect(message).to.have.property('active');
      expect(message).to.have.property('createdAt');
      expect(message).to.have.property('updatedAt');
    });

    it('should throw for message not found', async function () {
      let hasError = false;
      try {
        await service.detail(repositories, 'abc123');
      } catch (e) {
        hasError = true;
        expect(e.name).to.be.equal('NotFoundError');
      }
      expect(hasError).to.be.equal(true);
    });
  });
});
