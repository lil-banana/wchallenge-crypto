import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
})
  .then(db => console.log('Connected to database'))
  .catch(error => console.log(error))