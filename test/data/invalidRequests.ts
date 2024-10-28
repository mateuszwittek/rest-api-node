import { IInvalidRequestCase } from '../../src/types/types';

const invalidRequestsData: IInvalidRequestCase[] = [
  {
    description: 'empty name',
    data: { name: '', username: 'emptyname', email: 'empty.name@gmail.com' },
  },
  {
    description: 'invalid name characters',
    data: {
      name: 'Invalid Name123',
      username: 'invalidname',
      email: 'invalid.name@gmail.com',
    },
  },
  {
    description: 'short username',
    data: { name: 'Short Username', username: 'sh', email: 'short.username@gmail.com' },
  },
  {
    description: 'long username',
    data: {
      name: 'Long Username',
      username: 'thisusernameiswaytoolongandshouldfail',
      email: 'long.username@egmail.com',
    },
  },
  {
    description: 'invalid email format',
    data: { name: 'Invalid Email', username: 'invalidemail', email: 'not-an-email' },
  },
  {
    description: 'missing name',
    data: { username: 'missingname', email: 'missing.name@gmail.com' },
  },
  {
    description: 'missing username',
    data: { name: 'Missing Username', email: 'missing.username@egmail.com' },
  },
  {
    description: 'missing email',
    data: { name: 'Missing Email', username: 'missingemail' },
  },
  {
    description: 'invalid email domain',
    data: { name: 'Invalid Email', username: 'invalidemail', email: 'invalid.email@gmail' },
  },
  {
    description: 'disposable email',
    data: { name: 'Disposable Email', username: 'disposableemail', email: 'X5l7d@example.com' },
  },
];

export default invalidRequestsData;
