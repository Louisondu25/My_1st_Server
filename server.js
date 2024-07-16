// Importe le module Express et le module Lodash
const express = require("express");
const _ = require("lodash");

// Importe le module body-parser
const bodyparser = require("body-parser");

// Importe le fichier de configuration et le numéro de port
const config = require("./config");

// Crée une instance de l'application Express
const app = express();

//Demarrage de la database
require("./utils/database");

const Logger = require('./utils/logger').pino

const database_middleware = require('./middleware/database_middleware')
const addLogger = require('./middleware/logger_middleware')

// Utilise le middleware body-parser pour analyser les données JSON envoyées dans le corps des requêtes
app.use(bodyparser.json(), addLogger.Log);

// Importe le contrôleur pour les utilisateurs
const UserController = require('./controllers/UserController');
// Importe le contrôleur pour les Articles
const ArticleController = require('./controllers/ArticleController');

// Définit une route pour ajouter un utilisateur
app.post("/user", database_middleware.checkMongooseConnection, UserController.addOneUser);

// Définit une route pour ajouter plusieurs utilisateurs
app.post(`/users`, database_middleware.checkMongooseConnection, UserController.addManyUsers);

// Définit une route pour récupérer un utilisateur par Id
app.get(`/user/:id`, database_middleware.checkMongooseConnection, UserController.findOneUserById);

// Définit une route pour récupérer un utilisateur
app.get(`/user`, database_middleware.checkMongooseConnection, UserController.findOneUser);

// Définit une route pour récupérer plusieur utilisateurs
app.get(`/users_by_filters`, database_middleware.checkMongooseConnection, UserController.findManyUsers);

// Définit une route pour récupérer plusieurs utilisateurs par Ids
app.get(`/users`, database_middleware.checkMongooseConnection, UserController.findManyUserByIds);

// Définit une route pour mettre à jour un utilisateur
app.put(`/user/:id`, database_middleware.checkMongooseConnection, UserController.updateOneUser);

// Définit une route pour mettre à jour plusieurs utilisateurs
app.put(`/users`, database_middleware.checkMongooseConnection, UserController.updateManyUsers);

// Définit une route pour supprimer un utilisateur
app.delete(`/user/:id`, database_middleware.checkMongooseConnection, UserController.deleteOneUser);

// Définit une route pour supprimer plusieurs utilisateurs
app.delete(`/users`, database_middleware.checkMongooseConnection, UserController.deleteManyUsers);

// Définit une route pour ajouter un utilisateur
app.post("/article", database_middleware.checkMongooseConnection, ArticleController.addOneArticle);

// Définit une route pour ajouter plusieurs utilisateurs
app.post(`/articles`, database_middleware.checkMongooseConnection, ArticleController.addManyArticles);

// Définit une route pour récupérer un utilisateur par Id
app.get(`/article/:id`, database_middleware.checkMongooseConnection, ArticleController.findOneArticleById);

// Définit une route pour récupérer un utilisateur
app.get(`/article`, database_middleware.checkMongooseConnection, ArticleController.findOneArticle);

// Définit une route pour récupérer plusieur utilisateurs
app.get(`/articles_by_filters`, database_middleware.checkMongooseConnection, ArticleController.findManyArticles);

// Définit une route pour récupérer plusieurs utilisateurs par Ids
app.get(`/articles`, database_middleware.checkMongooseConnection, ArticleController.findManyArticleByIds);

// Définit une route pour mettre à jour un utilisateur
app.put(`/article/:id`, database_middleware.checkMongooseConnection, ArticleController.updateOneArticle);

// Définit une route pour mettre à jour plusieurs utilisateurs
app.put(`/articles`, database_middleware.checkMongooseConnection, ArticleController.updateManyArticles);

// Définit une route pour supprimer un utilisateur
app.delete(`/article/:id`, database_middleware.checkMongooseConnection, ArticleController.deleteOneArticle);

// Définit une route pour supprimer plusieurs utilisateurs
app.delete(`/articles`, database_middleware.checkMongooseConnection, ArticleController.deleteManyArticles);

// Démarre le serveur et affiche un message de log
app.listen(config.port, () => {
  Logger.info(`Le Serveur est démarré ${config.port}`)
});

module.exports = app