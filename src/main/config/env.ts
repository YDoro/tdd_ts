export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27019/clean-node-api',
  port: process.env.PORT || 2306,
  jwtSecret: process.env.JWT_SECRET || '5e8edd851d2fdfbd7415232c67367cc3a'
}
