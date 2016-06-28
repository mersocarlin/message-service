import mongoose from 'mongoose';
import restify from 'restify';


const Message = mongoose.model('messages');


export default function messageRepository () {
  return {
    create: create.bind(this),
    findAll: findAll.bind(this),
    findById: findById.bind(this),
    update: update.bind(this),
    remove: remove.bind(this),
  };
}


async function create (message) {
  return new Promise((resolve, reject) => {
    new Message({ ...message })
      .save()
      .then(dbMessage => resolve(dbMessage))
      .catch(err => reject(err));
  });
}

async function findAll () {
  return new Promise((resolve, reject) => {
    Message
      .find({ active: true })
      .sort('-createdAt')
      .exec((err, messages) => {
        if (err) reject(err);
        resolve(messages);
      });
  });
}

async function findById (id) {
  return new Promise((resolve, reject) => {
    Message
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .exec((err, message) => {
        if (err) reject(err);
        resolve(message);
      });
  });
}

async function update (id, message) {
  const dbMessage = await findById(id);

  if (!dbMessage) {
    throw new restify.errors.BadRequestError('Message not found.');
  }

  dbMessage.name = message.name;
  dbMessage.subject = message.subject;
  dbMessage.content = message.content;
  dbMessage.updatedAt = message.updatedAt;

  return new Promise((resolve, reject) => {
    dbMessage.save(err => {
      if (err) reject(err);
      resolve(dbMessage);
    });
  });
}

async function remove (id) {
  const dbMessage = await findById(id);

  if (!dbMessage) {
    throw new restify.errors.BadRequestError('Message not found.');
  }

  dbMessage.active = false;

  return new Promise((resolve, reject) => {
    dbMessage.save(err => {
      if (err) reject(0);
      resolve(1);
    });
  });
}
