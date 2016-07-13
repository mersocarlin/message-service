import { NotFoundError } from 'meaning-error';


const messageList = [];


export default function messageRepository () {
  return {
    create: create.bind(this),
    findAll: findAll.bind(this),
    findById: findById.bind(this),
    update: update.bind(this),
    remove: remove.bind(this),
  };
}

function generateId () {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}


async function create (message) {
  return new Promise(resolve => {
    message._id = generateId();
    messageList.push(message);
    resolve(message);
  });
}

async function findAll () {
  return new Promise(resolve => {
    resolve(
      messageList
        .filter(message => message.active)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) return -1;
          if (a.createdAt < b.createdAt) return 1;
          return 0;
        })
    );
  });
}

async function findById (id) {
  return new Promise(resolve => {
    resolve(messageList.find(message => message._id === id));
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

  return new Promise(resolve => {
    const index = messageList.findIndex(m => m._id === id);
    messageList[index] = dbMessage;
    resolve(dbMessage);
  });
}

async function remove (id) {
  const dbMessage = await findById(id);

  if (!dbMessage) {
    throw new NotFoundError('Message not found.');
  }

  dbMessage.active = false;

  return new Promise(resolve => {
    const index = messageList.findIndex(m => m._id === id);
    messageList[index] = dbMessage;
    resolve(true);
  });
}
