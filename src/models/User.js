import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true,
      enum: ['ars', 'eur', 'usd']
    },
    coins: [String]
  },
  {
    versionKey: false,
  }
);

userSchema.statics.encrypt = async (password) => {
  return await bcrypt.hash(password, 12)
}

userSchema.statics.compare = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword)
}

export default model('User', userSchema)