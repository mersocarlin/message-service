import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  active: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, required: true },
});


export default mongoose.model('messages', MessageSchema);
