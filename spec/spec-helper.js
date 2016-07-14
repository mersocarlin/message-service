import messageRepository from '../src/repository/message';


export function createBigString () {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 10000; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function getRepositories (mongo) {
  return {
    message: messageRepository(mongo),
  };
}
