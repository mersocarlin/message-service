import mongoose from 'mongoose';

import { default as env } from './env';
import { default as model } from '../db/models/message';
import messageRepository from '../src/repository/message';

export default {
  env,
  repositories: {
    message: messageRepository(model),
  },
};
