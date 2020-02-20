const app = require('../src/app');

describe('App', () => {
  it('GET /address responds with 200 containing empty array"', () => {
    return supertest(app)
      .get('/address')
      .expect(200, { addresses: [] });
  });
});
