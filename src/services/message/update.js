import validate from './validate';


export default async function update (repositories, data) {
  const message = updateData(data);
  await validate(message);

  return await repositories
    .message
    .update(data.id, message);
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
