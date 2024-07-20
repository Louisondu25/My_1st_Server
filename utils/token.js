const jwt = require ('jsonwebtoken')
const Configfile = require ('./../config')

module.exports.createToken = function (payLoad, options) {
    return jwt.sign(payLoad, Configfile.secret_key, {expiresIn: '2h'});
}