import fetch from 'node-fetch'
import User from '../models/User'

export const getAllCoins = async (req, res) => {
  const per_page = req.query.per_page || 100;
  const page = req.query.page || 1;
  
  const currency = req.currency;
  if(isNaN(per_page) || isNaN(page)) return res.status(400).json({message: 'Pagination parameters must be numeric'})
  if(per_page < 1 || per_page > 250) return res.status(400).json({message: 'Results per page must be between 1 and 250'})

  const coingeckoRes = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&per_page=${per_page}&page=${page}`)
  .then(response => response.json());

  const coinsData = coingeckoRes.map(({symbol, current_price, name, image, last_updated}) => ({symbol, current_price, name, image, last_updated}));
  
  res.status(200).json(coinsData)
}

export const followCoin = async (req, res) => {
  const coinId = req.body.coinId;
  
  if(!coinId) return res.status(400).json({message: 'No coin id provided'})

  const userCoins = await User.findById(req.userId).then(user => user.coins);

  if(userCoins.includes(coinId)) return res.status(409).json({message: 'Coin already followed'})

  const coingeckoRes = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
  
  if (coingeckoRes.status == 404) return res.status(404).json({message: 'Coin does not exist'})

  const userUpdated = await User.findByIdAndUpdate(req.userId,{coins: userCoins.concat(coinId)});

  res.status(201).json({message: `Now following ${coinId}`})
}

export const topN = async (req, res) => {
  const n = req.query.n;
  const order = req.query.order;

  const currency = req.currency;
  
  if (!n) return res.status(400).json({message: 'No number for top n provided'})
  if (isNaN(n) || n < 1 || n > 25) return res.status(400).json({message: 'Number is invalid or out of range'})

  let sortFunc;

  if (!order || order == 'desc') {
    sortFunc = (a, b) => parseFloat(b.current_price) - parseFloat(a.current_price);
  } else if (order == 'asc') {
    sortFunc = (a, b) => parseFloat(a.current_price) - parseFloat(b.current_price);
  } else {
    return res.status(400).json({message: 'Invalid order value given'})
  }

  const userCoins = await User.findById(req.userId).then(user => user.coins);

  const coinsStr = userCoins.join(',');

  const coingeckoRes = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinsStr}`)
  .then(res => res.json());

  const firstNCoinsData = coingeckoRes.sort(sortFunc).slice(0,n);

  const firstNIds = firstNCoinsData.map(coin => coin.id).join(',');
  
  const currencies = 'ars,eur,usd';
  const coingeckoPrices = await fetch(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=${currencies}&ids=${firstNIds}`)
  .then(res => res.json());

  const formattedCoins = firstNCoinsData.map(coin => ({
    symbol: coin.symbol,
    price: coingeckoPrices[coin.id],
    name: coin.name,
    image: coin.image,
    last_updated: coin.last_updated,
  }));

  res.status(200).json(formattedCoins)
}