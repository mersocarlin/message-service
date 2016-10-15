import { NotFoundError } from 'meaning-error';
import validate from './validate';


export default async function update (repositories, data) {
  if (!data.id) {
    throw new NotFoundError('Could not find message. Id not set.');
  }

  const message = updateData(data);
  await validate(message);

  const dbMessage = await repositories
    .message
    .findById(data.id);

  if (!dbMessage) {
    throw new NotFoundError('Could not find message.');
  }

  dbMessage.name = data.name;
  dbMessage.email = data.email;
  dbMessage.subject = data.subject;
  dbMessage.content = data.content;
  dbMessage.updatedAt = data.updatedAt;

  return await repositories
    .message
    .update(data.id, dbMessage);
}

function updateData (data) {
  const now = new Date();

  return {
    name: data.name,
    email: data.email,
    subject: data.subject,
    content: data.content,
    updatedAt: now,
  };
}
