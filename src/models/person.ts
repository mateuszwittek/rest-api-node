import { IPerson, IPersonDocument, IPersonModel } from '../types/types';
import mongoose, { Document } from 'mongoose';
import messages from '../utils/messages.js';

const PersonSchema = new mongoose.Schema<IPersonDocument>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const Person = mongoose.model<IPersonDocument, IPersonModel>('Person', PersonSchema);

export default Person;
