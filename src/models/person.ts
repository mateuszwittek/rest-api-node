import { IPersonDocument, IPersonModel } from '../types/types';
import mongoose from 'mongoose';

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
