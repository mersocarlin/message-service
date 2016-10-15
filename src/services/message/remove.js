import { NotFoundError } from 'meaning-error';


export default async function remove (repositories, id) {
  if (!id) {
    throw new NotFoundError('Could not find message. Id not set.');
  }

  const dbMessage = await repositories
    .message
    .findById(id);

  if (!dbMessage) {
    throw new NotFoundError('Could not find message.');
  }

  await repositories
    .message
    .remove(id);
}
