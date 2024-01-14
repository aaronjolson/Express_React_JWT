const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY || 'your_secret_key',
  DB_CONFIG: {
    host: 'db',
    port: 5432,
    database: 'MYDATA',
    user: 'your_username',
    password: 'your_password'
  }
};