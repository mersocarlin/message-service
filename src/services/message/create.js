import validate from './validate';


export default async function create (repositories, data) {
  const message = createData(data);
  await validate(message);

  return await repositories
    .message
    .create(message);
}

function createData (data) {
  const now = new Date();

  return {
    name: data.name,
    email: data.email,
    subject: data.subject,
    content: data.content,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
}
