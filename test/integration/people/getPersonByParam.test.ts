import app from '../../../src/app';
import { NotFoundError } from '../../../src/errors/customErrors';
import { cleanupDatabase, createPerson, makeRequest } from '../../utils/utils';

const api = makeRequest(app);

describe('GET /people/:param', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('should get person by username', async () => {
    const person = await createPerson();
    const res = await api.get(`/people/${person.username}`);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe(person.username);
  });

  it('should get person by email', async () => {
    const person = await createPerson();
    const res = await api.get(`/people/${person.email}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(person.email);
  });

  it('should return 404 if person not found', async () => {
    const res = await api.get('/people/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(NotFoundError('person').message);
  });
});
