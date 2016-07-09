import { NotFoundError } from 'meaning-error';


export default async function detail (repositories, id) {
  const message = await repositories
    .message
    .findById(id);

  if (!message) {
    throw new NotFoundError('Could not find message.');
  }

  return message;
}
