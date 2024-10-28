import app from '../../../src/app';
import messages from '../../../src/utils/messages';
import { validPerson } from '../../data/constants';
import { cleanupDatabase, createPerson, makeRequest } from '../../utils/utils';
import invalidRequestsData from '../../data/invalidRequests';

const api = makeRequest(app);

describe('POST /people', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('should create a new person with valid data', async () => {
    const res = await api.post('/people', validPerson);
    expect(res.status).toBe(201);
    expect(res.body.data.username).toBe(validPerson.username);
    expect(res.body.message).toBe(messages.success.PERSON_ADDED);
  });

  test.each(invalidRequestsData)('should reject $description', async ({ data }) => {
    const res = await api.post('/people', data);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe(messages.error.ERROR);
  });

  it('should reject duplicate username', async () => {
    await createPerson();
    const res = await api.post('/people', {
      ...validPerson,
      email: 'different@gmail.com',
    });
    expect(res.status).toBe(409);
  });

  it('should reject duplicate email', async () => {
    await createPerson();
    const res = await api.post('/people', {
      ...validPerson,
      username: 'different',
    });
    expect(res.status).toBe(409);
  });
});
