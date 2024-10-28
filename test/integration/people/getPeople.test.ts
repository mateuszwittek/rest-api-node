import app from '../../../src/app';
import messages from '../../../src/utils/messages';
import { validPerson, validPerson2 } from '../../data/constants';
import { cleanupDatabase, createPerson, makeRequest } from '../../utils/utils';

const api = makeRequest(app);

describe('GET /people', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('should return an empty array when no people exist', async () => {
    const res = await api.get('/people');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.message).toBe(messages.success.PEOPLE_RETRIEVED);
  });

  it('should return all people', async () => {
    await createPerson(validPerson);
    await createPerson(validPerson2);

    const res = await api.get('/people');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.message).toBe(messages.success.PEOPLE_RETRIEVED);
  });
});
