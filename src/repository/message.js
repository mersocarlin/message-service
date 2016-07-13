import { NotFoundError } from 'meaning-error';


export default function messageRepository (model) {
  return {
    create: create.bind(this, model),
    findAll: findAll.bind(this, model),
    findById: findById.bind(this, model),
    update: update.bind(this),
    remove: remove.bind(this),
  };
}


async function create (Model, message) {
  return new Promise((resolve, reject) => {
    new Model({ ...message })
      .save()
      .then(dbMessage => resolve(dbMessage))
      .catch(err => reject(err));
  });
}

async function findAll (Model) {
  return new Promise((resolve, reject) => {
    Model
      .find({ active: true })
      .sort('-createdAt')
      .exec((err, messages) => {
        if (err) reject(err);
        resolve(messages);
      });
  });
}

async function findById (Model, id) {
  return new Promise((resolve, reject) => {
    Model
      .findOne({ _id: id, active: true })
      .exec((err, message) => {
        if (err) reject(err);
        resolve(message);
      });
  });
}

async function update (id, message) {
  const dbMessage = await findById(id);

  if (!dbMessage) {
    throw new NotFoundError('Message not found.');
  }

  dbMessage.name = message.name;
  dbMessage.email = message.email;
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
    throw new NotFoundError('Message not found.');
  }

  dbMessage.active = false;

  return new Promise((resolve, reject) => {
    dbMessage.save(err => {
      if (err) reject(false);
      resolve(true);
    });
  });
}
