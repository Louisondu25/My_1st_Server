// Importe le module Express et le module Lodash
const express = require("express");
const _ = require("lodash");

// Importe le module body-parser
const bodyparser = require("body-parser");

// Importe le fichier de configuration et le numéro de port
const config = require("./config");

// Crée une instance de l'application Express
const app = express();

// Utilise le middleware body-parser pour analyser les données JSON envoyées dans le corps des requêtes
app.use(bodyparser.json());

//Demarrage de la database
require("./utils/database");

// Importe le contrôleur pour les utilisateurs
const UserController = require("./controllers/UserController");

// Définit une route pour ajouter un utilisateur
app.post("/user", UserController.addOneUser);

// Définit une route pour ajouter plusieurs utilisateurs
app.post(`/users`, UserController.addManyUsers);

// Définit une route pour récupérer un utilisateur
app.get(`/user/:id`, UserController.findOneUser);

// Définit une route pour récupérer plusieurs utilisateurs
app.get(`/users`, UserController.findManyUsers);

// Définit une route pour mettre à jour un utilisateur
app.put(`/user/:id`, UserController.updateOneUser);

// Définit une route pour mettre à jour plusieurs utilisateurs
app.put(`/users`, UserController.updateManyUsers);

// Définit une route pour supprimer un utilisateur
app.delete(`/user/:id`, UserController.deleteOneUser);

// Définit une route pour supprimer plusieurs utilisateurs
app.delete(`/users`, UserController.deleteManyUsers);

// Démarre le serveur et affiche un message de log
app.listen(config.port, () => {
  console.log(
    `${new Date().toLocaleString()}: Le serveur est démarré ${config.port}`
  );
});
