const Loggerhttp = require('../utils/logger').http

module.exports.Log = function (req, res, next) {
    Loggerhttp(req, res);
    next()
}