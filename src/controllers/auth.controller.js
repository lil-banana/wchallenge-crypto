import jwt from 'jsonwebtoken'
import User from '../models/User'

export const signup = async (req, res) => {
  const currencies = ['ars', 'eur', 'usd'];
  const {name, surname, username, password, currency} = req.body;

  if (!name || !surname || !username || !password || !currency) return res.status(400).json({message: 'Missing user data'})

  if (!password.match(/[a-zA-Z0-9]{8,}/g)) return res.status(403).json({message: 'The password did not meet the requirements'})
  if (!currencies.includes(currency)) return res.status(403).json({message: 'The currency did not meet the requirements'})

  if (await User.findOne({username})) return res.status(409).json({message: 'The user already exists'})

  const newUser = new User({
    name,
    surname,
    username,
    password: await User.encrypt(password),
    currency
  });
  
  const savedUser = await newUser.save();

  const token = jwt.sign({id: savedUser._id, currency: savedUser.currency}, process.env.JWT_SECRET, {expiresIn: 3600});

  res.status(201).json({token})
}

export const login = async (req, res) => {
  const {username, password} = req.body;

  const user = await User.findOne({username});

  if (!user) return res.status(401).json({message: 'The username is not correct'})
  
  const passwordMatch = await User.compare(password, user.password)

  if (!passwordMatch) return res.status(401).json({message: 'The password is not correct'})

  const token = jwt.sign({id: user._id, currency: user.currency}, process.env.JWT_SECRET, {expiresIn: 3600});

  res.status(200).json({token})
}