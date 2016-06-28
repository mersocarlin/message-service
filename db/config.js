import mongoose from 'mongoose';

import './models/message';


export async function startDB () {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb' + '/db-messages', (err) => {
      if (err) {
        console.log('ERROR ', err);
        reject();
      } else {
        resolve();
      }
    });
  });
}
