const ArticleService = require('../services/ArticleService')


// La fonction permet de connecter un utilisateur.
module.exports.loginUser = function (req, res, next) {
    passport.authenticate('login', { badRequestMessage: "Les champs sont manquants." }, async function (err, user) {
        if (err) {
            res.statusCode = 401
            return res.send({ msg: "Le nom d'utilisateur ou mot de passe est incorrect.", type_error: "no-valid-login" })
        }
        else {
            req.logIn(user, async function (err) {
                if (err) {
                    res.statusCode = 500
                    return res.send({ msg: "Problème d'authentification sur le serveur.", type_error: "internal" })
                }
                else {
                    return res.send(user)
                }
            });
        }
    })(req, res, next)
}

// La fonction permet d'ajouter un utilisateur.
module.exports.addOneArticle = function (req, res) {
    req.log.info('Creation d\'un Article')
    ArticleService.addOneArticle(req.body, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "duplicate") {
            res.statusCode = 405
            res.send(err)
        }
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

module.exports.addManyArticles = function (req, res) {
    req.log.info('Creation de plusieurs Articles')
    ArticleService.addManyArticles(req.body, null, function (err, value) {
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

module.exports.findOneArticleById = function (req, res) {

    req.log.info('Rechercher un Article')
    var opts = { populate: req.query.populate }
    ArticleService.findOneArticleById(req.params.id, opts, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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

module.exports.findManyArticleByIds = function (req, res) {
    req.log.info('Rechercher plusieurs Articles')
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var opts = { populate: req.query.populate }

    ArticleService.findManyArticleByIds(arg, opts, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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

module.exports.findOneArticle = function (req, res) {
    req.log.info('Rechercher un Article avec un champs choisi')
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var opts = { populate: req.query.populate }
    ArticleService.findOneArticle(arg, req.query.value, opts, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "duplicate") {
            res.statusCode = 405
            res.send(err)
        }
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

module.exports.findManyArticles = function (req, res) {
    req.log.info('Rechercher des Articles')
    var page = req.query.page
    var limit = req.query.limit
    var search = req.query.q
    var opts = { populate: req.query.populate }
    ArticleService.findManyArticles(search, page, limit, opts, function (err, value) {
        if (err && err.type_error == 'no-valid') {
            res.statusCode = (405)
            res.send(err)
        } else if (err && err.type_error == 'error-mongo') {
            res.statusCode = (500)
            res.send(err)
        }
        else {
            res.statusCode = (200)
            res.send(value)
        }
    })
}

module.exports.updateOneArticle = function (req, res) {
    req.log.info('Modifier un Article')
    const articleId = req.params.id;
    const articleData = req.body;

    ArticleService.updateOneArticle(articleId, articleData, null, function (err, article) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err && err.type_error == "validator" || err && err.type_error == "duplicate")) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(article)
        }
    })
}

module.exports.updateManyArticles = function (req, res) {

    req.log.info('Modifier plusieurs Articles')
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    ArticleService.updateManyArticles(arg, updateData, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == "duplicate")) {
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

module.exports.deleteOneArticle = function (req, res) {

    req.log.info('Supprimer un Article')
    ArticleService.deleteOneArticle(req.params.id, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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

module.exports.deleteManyArticles = function (req, res) {
    req.log.info('Supprimer plusieurs Articles')
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    ArticleService.deleteManyArticles(arg, null, function (err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
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