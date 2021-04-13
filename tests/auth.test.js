import app from '../src/app'
import request from 'supertest'
import User from '../src/models/User'

const newUser = {
  name: 'Pepito',
  surname: 'Perez',
  username: 'elpepe',
  password: 'pepe1234',
  currency: 'ars'
};
const repeatedUser = {
  name: 'Jane',
  surname: 'Doe',
  username: 'jane',
  password: 'password123',
  currency: 'usd'
};

beforeAll(async () => {
  await User.deleteMany({username: { $in: [newUser.username, repeatedUser.username]}});
  await request(app)
  .post('/auth/signup')
  .send(repeatedUser);
});

afterAll(() => {
  User.deleteMany({username: { $in: [newUser.username, repeatedUser.username]}});
});

describe('/auth/signup', () => {
  it('creates a new user', async (done) => {
    const res = await request(app)
    .post('/auth/signup')
    .send(newUser);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('token');
    expect(res.status).toBe(201);
    done();
  });

  it('does not recieve incomplete information', async (done) => {
    const res = await request(app)
    .post('/auth/signup')
    .send({
      username: 'elpepe',
      password: 'pepe1234',
      currency: 'ars'
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(400);
    done();
  });

  it('does not recieve short password', async (done) => {
    const res = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Pepito',
      surname: 'Perez',
      username: 'elpepe',
      password: 'pepe',
      currency: 'ars'
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(403);
    done();
  });

  it('does not recieve non-alphanumeric password', async (done) => {
    const res = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Pepito',
      surname: 'Perez',
      username: 'elpepe',
      password: 'pepe@%#!',
      currency: 'ars'
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(403);
    done();
  });

  it('does not recieve other currencies', async (done) => {
    const res = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Pepito',
      surname: 'Perez',
      username: 'elpepe',
      password: 'pepe1234',
      currency: 'cop'
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(403);
    done();
  });

  it('does not allow to create duplicate username', async (done) => {
    const res = await request(app)
    .post('/auth/signup')
    .send(repeatedUser);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(409);
    done();
  });
});


describe('/auth/login', () => {
  it('logs in an user and returns a token', async (done) => {
    const res = await request(app)
    .post('/auth/login')
    .send({
      username: newUser.username,
      password: newUser.password
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('token');
    expect(res.status).toBe(200);
    done();
  });
  
  it('does not login for non-existent username', async (done) => {
    const res = await request(app)
    .post('/auth/login')
    .send({
      username: 'johndoe',
      password: 'password'
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(401);
    done();
  });
  
  it('does not login for incorrect password', async (done) => {
    const res = await request(app)
    .post('/auth/login')
    .send({
      username: newUser.username,
      password: 'password'
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(401);
    done();
  });
  
  it('does not login for missing username or password', async (done) => {
    const res = await request(app)
    .post('/auth/login')
    .send({
      username: newUser.username
    });
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(400);
    done();
  });
});