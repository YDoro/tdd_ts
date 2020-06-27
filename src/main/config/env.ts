export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27018/clean-node-api',
  port: process.env.port || 2306,
  jwtSecret: process.env.JWT_SECRET || '5e8edd851d2fdfbd7415232c67367cc3a'
}
