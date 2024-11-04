import app from '../../../src/app';
import { messages } from '../../../src/constants/messages';
import { Person } from '../../../src/models/person.model';
import { cleanupDatabase, createPerson, makeRequest } from '../../utils/utils';

const api = makeRequest(app);

describe('DELETE /people/:param', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('should delete person by username', async () => {
    const person = await createPerson();
    const res = await api.delete(`/people/${person.username}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(messages.success.PERSON_DELETED);

    const found = await Person.findOne({ username: person.username });
    expect(found).toBeNull();
  });

  it('should delete person by email', async () => {
    const person = await createPerson();
    const res = await api.delete(`/people/${person.email}`);
    expect(res.status).toBe(200);

    const found = await Person.findOne({ email: person.email });
    expect(found).toBeNull();
  });

  it('should return 404 for non-existent person', async () => {
    const res = await api.delete('/people/nonexistent');
    expect(res.status).toBe(404);
  });
});
