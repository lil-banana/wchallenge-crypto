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
  await User.findOneAndUpdate({username: newUser.username}, {coins: ['bitcoin', 'ripple', 'tether', 'cardano', 'polkadot']})
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
  }, 15000);

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
  }, 15000);

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
  }, 15000);

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

  it('denies the request when no token is sent', async (done) => {
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


describe('/coins/follow', () => {
  it('follows a coin', async (done) => {
    const res = await request(app)
    .post('/coins/follow')
    .set('x-access-token', token)
    .send({coinId: 'dogecoin'});

    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(201);
    done();
  }, 15000);

  it('does not follow a coin already followed', async (done) => {
    const res = await request(app)
    .post('/coins/follow')
    .set('x-access-token', token)
    .send({coinId: 'bitcoin'});

    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(409);
    done();
  });

  it('does not follow a coin that does not exist', async (done) => {
    const res = await request(app)
    .post('/coins/follow')
    .set('x-access-token', token)
    .send({coinId: 'nonexistentcoin'});

    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(404);
    done();
  }, 15000);

  it('denies the request when no coin is sent', async (done) => {
    const res = await request(app)
    .post('/coins/follow')
    .set('x-access-token', token)
    .send();
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    done();
  });

  it('denies the request when no token is sent', async (done) => {
    const res = await request(app)
    .post('/coins/follow')
    .send({coinId: 'ethereum'});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    done();
  });

  it('denies the request when token is invalid', async (done) => {
    const res = await request(app)
    .post('/coins/follow')
    .set('x-access-token', 'fakeorexpiredtoken')
    .send({coinId: 'ethereum'});
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    done();
  });
});


describe('/coins/top', () => {
  it('gets the top n of followed coins', async (done) => {
    const n = 4;
    const order = 'asc';

    const res = await request(app)
    .get('/coins/top')
    .set('x-access-token', token)
    .query({n, order});
    
    expect(res.type).toEqual('application/json');
    expect(res.body.length).toEqual(n);
    expect(res.body[0]).toEqual(expect.objectContaining({
      symbol: expect.any(String),
      price: expect.objectContaining({
        ars: expect.any(Number),
        eur: expect.any(Number),
        usd: expect.any(Number)
      }),
      name: expect.any(String),
      image: expect.any(String),
      last_updated: expect.any(String)
    }));
    expect(res.status).toBe(200);
    done();
  }, 15000);

  it('gets the top n of followed coins when no order param given', async (done) => {
    const n = 3;

    const res = await request(app)
    .get('/coins/top')
    .set('x-access-token', token)
    .query({n});
    
    expect(res.type).toEqual('application/json');
    expect(res.body.length).toEqual(n);
    expect(res.body[0]).toEqual(expect.objectContaining({
      symbol: expect.any(String),
      price: expect.objectContaining({
        ars: expect.any(Number),
        eur: expect.any(Number),
        usd: expect.any(Number)
      }),
      name: expect.any(String),
      image: expect.any(String),
      last_updated: expect.any(String)
    }));
    expect(res.status).toBe(200);
    done();
  }, 15000);

  it('denies the request when no n parameter is sent', async (done) => {
    const order = 'asc';

    const res = await request(app)
    .get('/coins/top')
    .set('x-access-token', token)
    .query({});
    
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(400);
    done();
  });

  it('denies the request when n parameter is not valid', async (done) => {
    const n = 'n';
    const order = 'asc';
    
    const res = await request(app)
    .get('/coins/top')
    .set('x-access-token', token)
    .query({n, order});
    
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(400);
    done();
  });

  it('denies the request when order parameter is not valid', async (done) => {
    const n = 5;
    const order = 'random';

    const res = await request(app)
    .get('/coins/top')
    .set('x-access-token', token)
    .query({n, order});
    
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('message');
    expect(res.status).toBe(400);
    done();
  });

  it('denies the request when no token is sent', async (done) => {
    const n = 4;
    const order = 'asc';

    const res = await request(app)
    .get('/coins/top')
    .query({n, order});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    done();
  });

  it('denies the request when token is invalid', async (done) => {
    const n = 4;
    const order = 'asc';
    
    const res = await request(app)
    .get('/coins/top')
    .set('x-access-token', 'fakeorexpiredtoken')
    .query({n, order});
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    done();
  });
})