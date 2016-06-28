import restify from 'restify';


export default async function validate (data) {
  if (!data.name) {
    throw new restify.errors.BadRequestError('Please inform your name.');
  }

  if (!data.subject) {
    throw new restify.errors.BadRequestError('Please inform your subject.');
  }

  if (!data.content) {
    throw new restify.errors.BadRequestError('Please inform your message.');
  }
}
