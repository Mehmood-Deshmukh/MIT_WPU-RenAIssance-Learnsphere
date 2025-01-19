const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWTSECRET, {
        expiresIn: 24 * 60 * 60,
    });
};

module.exports = {createToken};