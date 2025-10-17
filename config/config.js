require('dotenv').config();

module.exports = {
  db: {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, 
      host: process.env.DB_HOST,
      dialect: 'postgres',
    },
  },
  auth: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h', 
  }
}
