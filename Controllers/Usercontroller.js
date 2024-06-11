const UserService = require('../services/UserService')

// La fonction permet d'ajouter un utilisateur.
module.exports.addOneUser = function(req, res) {
    UserService.addOneUser(req.body, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if  (err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        } 
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet d'ajouter plusieurs utilisateurs.
module.exports.addManyUsers = function(req, res) {
    UserService.addManyUsers(req.body, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet de chercher un utilisateur.
module.exports.findOneUser = function(req, res) {
    UserService.findOneUser(req.params.id, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if  (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        } 
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de chercher plusieurs utilisateurs.
module.exports.findManyUsers = function(req, res) {
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    UserService.findManyUsers(arg, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if  (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        } 
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de supprimer un utilisateur.
module.exports.deleteOneUser = function(req, res) {
    UserService.deleteOneUser(req.params.id, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if  (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        } 
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de supprimer plusieurs utilisateurs.
module.exports.deleteManyUsers = function(req, res) {
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    UserService.deleteManyUsers(arg, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if  (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        } 
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de modifier un utilisateur.
module.exports.updateOneUser = function(req, res) {
  const userId = req.params.id;
  const userData = req.body;

  UserService.updateOneUser(userId, userData, function(err, user) {
    if (err && err.type_error == "no-found") {
      res.statusCode = 404
      res.send(err)
    }
    else if  (err && err.type_error == "no-valid") {
      res.statusCode = 405
      res.send(err)
    } 
    else if (err && err.type_error == "error-mongo") {
      res.statusCode = 500
      res.send(err)
    }
    else {
      res.statusCode = 200
      res.send(user)
    }
  })
}

// La fonction permet de modifier plusieurs utilisateurs.
module.exports.updateManyUsers = function(req, res) {
  const filter = req.body.filter;
  const update = req.body.update;

  UserService.updateManyUsers(filter, update, function(err, result) {
    if (err && err.type_error == "no-found") {
      res.statusCode = 404
      res.send(err)
    }
    else if  (err && err.type_error == "no-valid") {
      res.statusCode = 405
      res.send(err)
    } 
    else if (err && err.type_error == "error-mongo") {
      res.statusCode = 500
      res.send(err)
    }
    else {
      res.statusCode = 200
      res.send(result)
    }
  })
}