import app from '../src/app'
import request from 'supertest'
import User from '../src/models/User'

const newUser = {
  name: 'Test',
  surname: 'User',
  username: 'testuser',
  password: 'password',
  currency: 'eur'
};

let token;

beforeAll(async () => {
  await User.deleteMany({username: newUser.username});
  token = await request(app)
  .post('/auth/signup')
  .send(newUser)
  .then(res => res.body.token);
});

afterAll(async () => {
  await User.deleteMany({username: newUser.username});
});

describe('/coins', () => {
  it('gets coins data list when all parameters given', async (done) => {
    const per_page = 42;
    const page = 2;

    const res = await request(app)
    .get('/coins')
    .set('x-access-token', token)
    .query({
      per_page,
      page
    });

    expect(res.type).toEqual('application/json');
    expect(res.body.length).toEqual(per_page);
    expect(res.body[0]).toEqual(expect.objectContaining({
      symbol: expect.any(String),
      current_price: expect.any(Number),
      name: expect.any(String),
      image: expect.any(String),
      last_updated: expect.any(String)
    }));
    expect(res.status).toBe(200);
    done();
  }, 10000);

  it('gets 100 coins per page when per_page not given', async (done) => {
    const page = 3;

    const res = await request(app)
    .get('/coins')
    .set('x-access-token', token)
    .query({page});

    expect(res.type).toEqual('application/json');
    expect(res.body.length).toEqual(100);
    expect(res.body[0]).toEqual(expect.objectContaining({
      symbol: expect.any(String),
      current_price: expect.any(Number),
      name: expect.any(String),
      image: expect.any(String),
      last_updated: expect.any(String)
    }));
    expect(res.status).toBe(200);
    done();
  }, 10000);

  it('gets coins when page not given', async (done) => {
    const per_page = 3;

    const res = await request(app)
    .get('/coins')
    .set('x-access-token', token)
    .query({per_page});

    expect(res.type).toEqual('application/json');
    expect(res.body.length).toEqual(per_page);
    expect(res.body[0]).toEqual(expect.objectContaining({
      symbol: expect.any(String),
      current_price: expect.any(Number),
      name: expect.any(String),
      image: expect.any(String),
      last_updated: expect.any(String)
    }));
    expect(res.status).toBe(200);
    done();
  }, 10000);

  it('does not recieve non-numeric per_page or page', async (done) => {
    const per_page = 'perpage';
    const page = 2;

    const res = await request(app)
    .get('/coins')
    .set('x-access-token', token)
    .query({
      per_page,
      page
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    done();
  });

  it('does not recieve per_page out of range', async (done) => {
    const per_page = 300;
    const page = 4;

    const res = await request(app)
    .get('/coins')
    .set('x-access-token', token)
    .query({
      per_page,
      page
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    done();
  });

  it('denies the request when token is not sent', async (done) => {
    const per_page = 250;
    const page = 2;

    const res = await request(app)
    .get('/coins')
    .query({
      per_page,
      page
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    done();
  });

  it('denies the request when token is invalid', async (done) => {
    const per_page = 250;
    const page = 2;

    const res = await request(app)
    .get('/coins')
    .set('x-access-token', 'fakeorexpiredtoken')
    .query({
      per_page,
      page
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    done();
  });
});