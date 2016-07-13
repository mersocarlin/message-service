import mongoose from 'mongoose';

import { config as env } from './env';


export const config = {
  env,
  mongo: mongoose.model('messages'),
};
