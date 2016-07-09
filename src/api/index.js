import meaningError from 'meaning-error-middleware';


import checkHeader from '../middlewares/checkHeader';
import * as message from './message';


const wrap = fn => (...args) => fn(...args).catch(args[2]);


export default (app) => {
  app.use(checkHeader);

  app.get('/api/messages', wrap(message.list));
  app.get('/api/messages/:id', wrap(message.detail));
  app.post('/api/messages', wrap(message.create));
  app.post('/api/messages/:id', wrap(message.update));
  app.put('/api/messages/:id', wrap(message.update));
  app.delete('/api/messages/:id', wrap(message.remove));

  app.use(meaningError);
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err.stack || err); // eslint-disable-line no-console

    if (err) {
      res.sendStatus(500);
    }
  });
};
