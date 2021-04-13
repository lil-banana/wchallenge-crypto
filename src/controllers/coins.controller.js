import fetch from 'node-fetch'

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