import mongoose from 'mongoose';


export function startDB (config) {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.env.db.connectionString, (err) => {
      if (err) {
        console.log('ERROR ', err);
        reject();
      } else {
        resolve();
      }
    });
  });
}
