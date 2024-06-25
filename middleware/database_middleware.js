const mongoose = require('mongoose');


module.exports.checkMongooseConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    req.log.info ('Verification de la base de donnée : OK')
    next()
  } else {
    req.log.error();('Verification de la base de donnée : NON')
    res.statusCode = 500
    res.send({ msg: `La Base de donnée est en erreur ${mongoose.connection.readyState}`, type_error: 'error-connection-db' })
  }
};

