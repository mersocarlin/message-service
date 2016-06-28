import * as message from './message';


const wrap = fn => (...args) => fn(...args).catch(args[2]);


export default (app) => {
  app.get('/messages', wrap(message.list));
  app.get('/messages/:id', wrap(message.detail));
  app.post('/messages', wrap(message.create));
  app.post('/messages/:id', wrap(message.update));
  app.put('/messages/:id', wrap(message.update));
  app.del('/messages/:id', wrap(message.remove));


  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err.stack || err); // eslint-disable-line no-console

    if (err) {
      res.sendStatus(500);
    }
  });
};
