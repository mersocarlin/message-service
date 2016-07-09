import { BadRequestError } from 'meaning-error';


export default (req, res, next) => {
  if (!req.headers['x-client-id']) {
    throw new BadRequestError(`Cannot GET ${req.originalUrl}`);
  }

  const config = req.app.get('config');
  if (req.headers['x-client-id'] !== config.accessKey) {
    throw new BadRequestError(`Cannot GET ${req.originalUrl}`);
  }

  return next();
};
