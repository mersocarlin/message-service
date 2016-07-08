import { NotFoundError } from 'meaning-error';


export default async function remove (repositories, id) {
  const result = await repositories
    .message
    .remove(id);

  if (result === 0) {
    throw new NotFoundError('Could not find message to remove.');
  }

  return true;
}
