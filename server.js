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
const addLogger = require ('./middleware/logger_middleware')

// Utilise le middleware body-parser pour analyser les données JSON envoyées dans le corps des requêtes
app.use(bodyparser.json(), addLogger.Log);

// Importe le contrôleur pour les utilisateurs
const UserController = require('./controllers/UserController');

// Définit une route pour ajouter un utilisateur
app.post("/user", database_middleware.checkMongooseConnection , UserController.addOneUser);

// Définit une route pour ajouter plusieurs utilisateurs
app.post(`/users`, database_middleware.checkMongooseConnection, UserController.addManyUsers);

// Définit une route pour récupérer un utilisateur
app.get(`/user/:id`, database_middleware.checkMongooseConnection, UserController.findOneUser);

// Définit une route pour récupérer plusieurs utilisateurs
app.get(`/users`, database_middleware.checkMongooseConnection, UserController.findManyUsers);

// Définit une route pour mettre à jour un utilisateur
app.put(`/user/:id`, database_middleware.checkMongooseConnection, UserController.updateOneUser);

// Définit une route pour mettre à jour plusieurs utilisateurs
app.put(`/users`, database_middleware.checkMongooseConnection, UserController.updateManyUsers);

// Définit une route pour supprimer un utilisateur
app.delete(`/user/:id`, database_middleware.checkMongooseConnection, UserController.deleteOneUser);

// Définit une route pour supprimer plusieurs utilisateurs
app.delete(`/users`, database_middleware.checkMongooseConnection, UserController.deleteManyUsers);

// Démarre le serveur et affiche un message de log
app.listen(config.port, () => {
  Logger.info(`Le Serveur est démarré ${config.port}`)
});

module.exports = app