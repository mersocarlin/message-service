import restify from 'restify';


export default async function detail (repositories, id) {
  const message = await repositories
    .message
    .findById(id);

  if (!message) {
    throw new restify.errors.NotFoundError('Could not find message.');
  }

  return message;
}
