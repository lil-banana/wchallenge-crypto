# WChallenge - Cryptocurrencies Monitor

a CoinGecko wrapper with added authentication services

---
## Requirements

For development, you will only need MongoDB, Node.js and npm installed in your environement.

---

## Install

    $ git clone https://github.com/lil-banana/wchallenge-crypto
    $ cd wchallenge-crypto
    $ npm install

## Configure app

Add a .env file at the root of the project directory. You will need the following content:

```
MONGODB_URL=YOUR_MONGO_URL
JWT_SECRET=YOUR_SECRET
```

## Running the project

    $ npm start

## Testing

    $ npm test

## Generating coverage files

    $ npm run test:cover

## Documentation

The API documentation will be found in the localhost:3000/api-docs route
    
    
