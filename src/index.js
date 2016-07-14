import express from 'express';
import bodyParser from 'body-parser';


import api from './api';


export async function application (config) {
  const app = express();

  app.set('config', config);
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    req.mongo = config.mongo;
    next();
  });

  api(app);

  return app;
}


export const start = (config) => new Promise(async resolve => {
  const app = await application(config);
  app.listen(config.env.http.port, config.env.http.host, () => {
    /* eslint-disable no-console */
    console.info(`message-service started at [ http://${config.env.http.host}:${config.env.http.port} ]`);

    resolve();
  });
});
