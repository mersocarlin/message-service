
export default function messageRepository (model) {
  return {
    create: create.bind(this, model),
    findAll: findAll.bind(this, model),
    findById: findById.bind(this, model),
    update: update.bind(this, model),
    remove: remove.bind(this, model),
  };
}


async function create (model, message) {
  return new Promise((resolve, reject) => {
    model.create(
      message,
      (err, createdMessage) => {
        if (err) reject(err);
        resolve(createdMessage);
      }
    );
  });
}

async function findAll (model) {
  return new Promise((resolve, reject) => {
    model
      .find({ active: true })
      .sort('-createdAt')
      .exec((err, messages) => {
        if (err) reject(err);
        resolve(messages);
      });
  });
}

async function findById (model, id) {
  return new Promise((resolve, reject) => {
    model
      .findOne({ _id: id, active: true })
      .exec((err, message) => {
        if (err) reject(err);
        if (!message) {
          resolve(null);
          return;
        }

        resolve(message);
      });
  });
}

async function update (model, id, dbMessage) {
  return new Promise((resolve, reject) => {
    model.update(
      { _id: id },
      { $set: dbMessage },
      {},
      (err) => {
        if (err) reject(err);
        resolve(dbMessage);
      }
    );
  });
}

async function remove (model, id) {
  return new Promise((resolve, reject) => {
    model.update(
      { _id: id },
      {
        $set: {
          active: false,
        },
      },
      {},
      (err) => {
        if (err) reject(false);
        resolve(true);
      }
    );
  });
}
