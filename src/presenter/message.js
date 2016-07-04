export default function (data) {
  if (Array.isArray(data)) {
    return list(data);
  }

  return detail(data);
}


function list (messages) {
  const result = messages.map(message => detail(message));

  return result;
}


function detail (message) {
  return {
    _id: message._id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    content: message.content,
    createdAt: message.createdAt,
  };
}
