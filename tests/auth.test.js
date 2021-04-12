import app from '../src/app'
import request from 'supertest'

const newUser = {
  name: 'Pepito',
  surname: 'Perez',
  username: 'elpepe',
  password: 'pepe1234',
  currency: 'ars'
};

describe('/auth/signup', () => {
  it('creates a new user', async (done) => {
    const res = await request(app)
    .get('/auth/signup')
    .send(newUser);
    expect(res.type).toEqual('application/json');
    expect(res.status).toBe(201);
    done();
  });
});