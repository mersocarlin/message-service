import restify from 'restify';


const SAFE_LENGTH = 5000;


export default async function validate (data) {
  if (!data.name) {
    throw new restify.errors.BadRequestError('Please inform your name.');
  }

  if (!data.email || !validateEmail(data.email)) {
    throw new restify.errors.BadRequestError('Your email address seems not to be valid.');
  }

  if (!data.subject) {
    throw new restify.errors.BadRequestError('Please inform your subject.');
  }

  if (!data.content) {
    throw new restify.errors.BadRequestError('Please inform your message.');
  }

  const isBigMessage = Object
    .keys(data)
    .filter(key => data[key].length > SAFE_LENGTH)
    .length > 0;

  if (isBigMessage) {
    throw new restify.errors.BadRequestError('Your message is too big for me.');
  }
}


function validateEmail (email) {
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}
