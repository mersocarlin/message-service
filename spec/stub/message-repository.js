import mongoose from 'mongoose';
import { NotFoundError } from 'meaning-error';

import messageFixtures from '../fixtures/message';

const ObjectId = mongoose.Types.ObjectId;
let list = [];

export default function messageRepository () {
  initDb();

  return {
    create: function (obj) {
      const newObj = {
        _id: ObjectId(),
        ...obj
      };

      list.push(newObj);

      return newObj;
    },
    findAll: function (query) {
      return list
        .filter(t => this.filterByActive(t));
    },
    findById: function (id) {
      return list.find(t => t._id.toString() === id.toString());
    },
    update: function (id, dbMessage) {
      const index = list.findIndex(t => t._id === id);
      list[index] = dbMessage;

      return dbMessage;
    },
    remove: function (id) {
      const index = list.findIndex(t => t._id === id);
      list[index].active = false;

      return true;
    },
    filterByActive (message) {
      return message.active;
    }
  }
}

function initDb () {
  messageFixtures.forEach(t => list.push(t));
}
