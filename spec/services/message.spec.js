import { expect } from 'chai';
import * as service from '../../src/services/message';
import { createBigString, getRepositories } from '../spec-helper';


describe('message-service', () => {
  describe('list', () => {
    it('should return an empty list of messages', async function () {
      const list = await service.list(getRepositories());
      expect(list).to.have.length(0);
    });
  });

  describe('create', () => {
    it('should create message', async function () {
      const data = {
        name: 'John Doe',
        email: 'john@doe.com',
        subject: 'Hey you!',
        content: 'I\'m sending a new message.',
      };

      const message = await service.create(getRepositories(), data);
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

      const message = await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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
          await service.create(getRepositories(), data);
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

  describe('update', function () {
    it('should update message', async function () {
      const createdMessage = await service.create(
        getRepositories(),
        {
          name: 'say my name',
          email: 'say@myemail.com',
          subject: 'say my subject',
          content: 'say my message',
        }
      );

      const message = await service.update(getRepositories(),
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
        getRepositories(),
        {
          name: 'say my name',
          email: 'say@myemail.com',
          subject: 'say my subject',
          content: 'say my message',
        }
      );

      const message = await service.update(getRepositories(),
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

    describe('validate', function () {
      it('should throw for message without id', async function () {
        let hasError = false;
        try {
          await service.update(getRepositories(), {});
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('NotFoundError');
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message that does not exist', async function () {
        let hasError = false;
        try {
          await service.update(getRepositories(),
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
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: '',
          email: 'mail@me.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your name.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty email', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: '',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your email.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with wrong email format', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: 'mail.me.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your email address seems to be invalid.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty subject', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: 'mail@me.com',
          subject: '',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your subject.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for message with empty content', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: 'name',
          email: 'mail@me.com',
          subject: 'subject',
          content: '',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Please inform your message.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big name string', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: createBigString(),
          email: 'john@doe.com',
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big email string', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: 'John Doe',
          email: `${createBigString()}@doe.com`,
          subject: 'subject',
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big subject string', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: 'John Doe',
          email: 'john@doe.com',
          subject: createBigString(),
          content: 'content',
        };

        let hasError = false;
        try {
          await service.update(getRepositories(), data);
        } catch (e) {
          hasError = true;
          expect(e.name).to.be.equal('BadRequestError');
          expect(e.message).to.be.equal('Your message is too big for me.');
          expect(e.code).to.be.equal(400);
        }
        expect(hasError).to.be.equal(true);
      });

      it('should throw for big content string', async function () {
        const messages = await service.list(getRepositories());
        const data = {
          id: messages[0]._id,
          name: 'John Doe',
          email: 'john@doe.com',
          subject: 'subject',
          content: createBigString(),
        };

        let hasError = false;
        try {
          await service.create(getRepositories(), data);
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

  describe('list', function () {
    it('should list all messages', async function () {
      const messages = await service.list(getRepositories());
      expect(messages).to.have.length(4);
      expect(messages[0]).to.have.property('_id');
      expect(messages[0]).to.have.property('name');
      expect(messages[0]).to.have.property('email');
      expect(messages[0]).to.have.property('subject');
      expect(messages[0]).to.have.property('content');
      expect(messages[0]).to.have.property('active');
      expect(messages[0]).to.have.property('createdAt');
      expect(messages[0]).to.have.property('updatedAt');
    });
  });

  describe('remove', function () {
    it('should delete message', async function () {
      const message = await service.create(getRepositories(), {
        name: 'DELETED NAME',
        email: 'deleted@mail.com',
        subject: 'DELETED SUBJECT',
        content: 'DELETED MESSAGE',
      });

      const removed = await service.remove(getRepositories(), message._id);
      expect(removed).to.be.equal(true);
    });

    it('should ommit deleted message from list', async function () {
      const message = await service.create(getRepositories(), {
        name: 'DELETED NAME',
        email: 'deleted@mail.com',
        subject: 'DELETED SUBJECT',
        content: 'DELETED MESSAGE',
      });

      await service.remove(getRepositories(), message._id);

      expect(await service.list(getRepositories())).to.have.length(4);
    });

    it('should not update deleted message', async function () {
      const message = await service.create(getRepositories(), {
        name: 'DELETED NAME',
        email: 'deleted@mail.com',
        subject: 'DELETED SUBJECT',
        content: 'DELETED MESSAGE',
      });
      await service.remove(getRepositories(), message._id);

      let hasError = false;
      try {
        await service.update(getRepositories(), message);
      } catch (e) {
        hasError = true;
        expect(e.name).to.be.equal('NotFoundError');
      }
      expect(hasError).to.be.equal(true);
    });
  });

  describe('detail', function () {
    it('should detail message', async function () {
      const messages = await service.list(getRepositories());
      const message = await service.detail(getRepositories(), messages[0]._id);

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
        await service.detail(getRepositories(), 'abc123');
      } catch (e) {
        hasError = true;
        expect(e.name).to.be.equal('NotFoundError');
      }
      expect(hasError).to.be.equal(true);
    });
  });
});
