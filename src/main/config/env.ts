export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb+srv://dev:123@cluster0.f5qqlvn.mongodb.net/?retryWrites=true&w=majority&authMechanism=DEFAULT',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'tj670==5H'
}
