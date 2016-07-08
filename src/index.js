import restify from 'restify';


import { startDB } from '../db/config';
import api from './api';


async function application (config) {
  const app = restify.createServer({
    name: 'message-service',
    version: '1.0.0',
  });

  app.use(restify.acceptParser(app.acceptable));
  app.use(restify.queryParser());
  app.use(restify.bodyParser());
  app.use(restify.CORS({
    origins: (config.cors || '*').split(','),
  }));

  await startDB();

  api(app);

  return app;
}


export const start = (config) => new Promise(async resolve => {
  const app = await application(config);

  app.listen(config.http.port, () => {
    console.info(`${app.name} listening at ${app.url}`); // eslint-disable-line no-console

    resolve();
  });
});
