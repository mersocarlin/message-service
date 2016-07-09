import { ForbiddenError } from 'meaning-error';


export default (req, res, next) => {
  if (!req.headers['x-client-id']) {
    throw new ForbiddenError('You don\'t have access to this route');
  }

  const config = req.app.get('config');
  if (req.headers['x-client-id'] !== config.accessKey) {
    throw new ForbiddenError('You don\'t have access to this route');
  }

  return next();
};
