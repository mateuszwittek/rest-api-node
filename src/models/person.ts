import { IPerson, IPersonDocument, IPersonModel } from '../types/types';
import mongoose, { Document } from 'mongoose';
import messages from '../utils/messages.js';

const PersonSchema = new mongoose.Schema<IPersonDocument>({
  id: {
    type: Number,
    unique: true,
  },
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

PersonSchema.pre<IPersonDocument>('validate', async function (next) {
  if (this.isNew && !this.id) {
    try {
      const lastPerson = await (this.constructor as IPersonModel).findOne(
        {},
        {},
        { sort: { id: -1 } }
      );
      this.id = lastPerson && lastPerson.id ? lastPerson.id + 1 : 1;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

PersonSchema.path('id').required(true, messages.error.ID_REQUIRED);

const Person = mongoose.model<IPersonDocument, IPersonModel>('Person', PersonSchema);

export default Person;
