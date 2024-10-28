import app from '../../../src/app';
import { makeRequest } from '../../utils/utils';

const api = makeRequest(app);

describe('CORS Configuration', () => {
  it('should set appropriate CORS headers', async () => {
    const res = await api
      .options('/people')
      .set('Origin', 'http://localhost:3001')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3001');
    expect(res.headers['access-control-allow-methods']).toBe('GET,POST,PUT,DELETE,OPTIONS');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should reject requests from non-allowed origins', async () => {
    const res = await api.get('/people').set('Origin', 'http://localhost.com:4000');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('Security Headers', () => {
  it('should set appropriate security headers', async () => {
    const res = await api.get('/people');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-xss-protection']).toBe('0');
  });

  it('should not include X-Powered-By header', async () => {
    const res = await api.get('/');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});
