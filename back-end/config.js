const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    JWT_PRIVATEKEY: process.env.JWT_PRIVATEKEY,
    port: process.env.PORT,
    MONGODB_USER: process.env.MONGODB_USER,
    MONGODB_URL: process.env.MONGODB_URL,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD
}