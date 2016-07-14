import { NotFoundError } from 'meaning-error';
import _filter from 'lodash.filter';
import _find from 'lodash.find';
import _orderBy from 'lodash.orderby';


export default class Mongo {
  constructor () {
    this.list = [];
    this.filteredList = [];
  }

  createId () {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  create (obj, cb) {
    obj._id = this.createId();
    this.list.push(obj);
    cb(null, obj);
  }

  find (condition) {
    this.filteredList = _filter(this.list, condition);
    return this;
  }

  findOne (condition) {
    this.filteredList = _find(this.list, condition);
    return this;
  }

  sort () {
    this.filteredList = _orderBy(this.filteredList, ['createdAt'], ['desc']);
    return this;
  }

  update (condition, set, options, cb) {
    this.findOne(condition);
    if (!this.filteredList) {
      throw new NotFoundError('Could not find message.');
    }

    const newObject = set.$set;
    const dbMessage = this.filteredList;
    dbMessage.name = newObject.name;
    dbMessage.email = newObject.email;
    dbMessage.subject = newObject.subject;
    dbMessage.content = newObject.content;
    dbMessage.updatedAt = newObject.updatedAt;

    const index = this.list.findIndex(m => m._id === dbMessage._id);
    this.list[index] = dbMessage;
    cb(null, newObject);
  }

  exec (cb) {
    cb(null, this.filteredList);
  }
}
