import app from '../src/app'
import request from 'supertest'
import User from '../src/models/User'


describe('/coins', () => {
  it('gets coins data list', async (done) => {
    const res = await request(app)
    .get('/coins')
    .query();
    expect(res.status).toBe(200);
    done();
  });
});