// Importe le module Express et le module Lodash
const { express } = require("express");
const _ = require("lodash");

// Importe le module body-parser
const { bodyparser } = require("bodyparser");

// Importe le fichier de configuration et le numéro de port
const { config, port } = require("./config");

// Crée une instance de l'application Express
const app = express();

// Utilise le middleware body-parser pour analyser les données JSON envoyées dans le corps des requêtes
app.use(bodyparser.json);

// Importe le contrôleur pour les utilisateurs
const Usercontroller = require("./Controllers/Usercontroller");

// Définit une route pour ajouter un utilisateur
app.post(`/user`, Usercontroller.addUser);

// Définit une route pour ajouter plusieurs utilisateurs
app.post(`/user`, Usercontroller.addManyUsers);

// Définit une route pour ajouter un utilisateur
app.post(`/user`, Usercontroller.addUser);

// Définit une route pour récupérer un utilisateur
app.post(`/user`, Usercontroller.findOneUser);

// Définit une route pour récupérer plusieurs utilisateurs
app.post(`/user`, Usercontroller.findManyUsers);

// Définit une route pour mettre à jour un utilisateur
app.post(`/user`, Usercontroller.updateOneUser);

// Définit une route pour mettre à jour plusieurs utilisateurs
app.post(`/user`, Usercontroller.updateManyUsers);

// Définit une route pour supprimer un utilisateur
app.delete(`/user`, Usercontroller.deleteOneUser);

// Définit une route pour supprimer plusieurs utilisateurs
app.delete(`/user`, Usercontroller.deleteManyUsers);

// Démarre le serveur et affiche un message de log
app.listen(port, () => {
  console.log(`${new Date().toLocaleString()}: Le serveur est démarré`);
});
