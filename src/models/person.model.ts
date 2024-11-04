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

export const Person = mongoose.model<IPersonDocument>('Person', PersonSchema);
