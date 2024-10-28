import app from '../../../src/app';
import { cleanupDatabase, createPerson, makeRequest } from '../../utils/utils';

const api = makeRequest(app);

describe('PUT /people/:param', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('should update person with valid partial data', async () => {
    const person = await createPerson();
    const update = { name: 'John Updated' };
    const res = await api.put(`/people/${person.username}`, update);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(update.name);
    expect(res.body.data.username).toBe(person.username);
  });

  it('should update using email as parameter', async () => {
    const person = await createPerson();
    const update = { name: 'John Updated' };
    const res = await api.put(`/people/${person.email}`, update);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(update.name);
  });

  it('should reject invalid update data', async () => {
    const person = await createPerson();
    const update = { name: '123' }; // Invalid name
    const res = await api.put(`/people/${person.username}`, update);
    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent person', async () => {
    const res = await api.put('/people/nonexistent', { name: 'New Name' });
    expect(res.status).toBe(404);
  });
});
