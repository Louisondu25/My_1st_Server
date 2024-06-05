// Importation de la bibliothèque Mongoose pour interagir avec la base de données MongoDB
const mongoose = require("mongoose");

// Définition du schéma de l'utilisateur (UserSchema) avec Mongoose
var UserSchema = mongoose.Schema({
  // Le champ "firstName" est de type chaîne de caractères et est obligatoire
  firstName: {
    type: String,
    required: true,
  },
  // Le champ "lastName" est de type chaîne de caractères et est obligatoire
  lastName: {
    type: String,
    required: true,
  },
  // Le champ "username" est de type chaîne de caractères et est obligatoire
  username: {
    type: String,
    required: true,
  },
  // Le champ "email" est de type chaîne de caractères et est obligatoire
  email: {
    type: String,
    required: true,
  },
  // Le champ "phone" est de type chaîne de caractères mais n'est pas obligatoire
  phone: String,
});

// Exportation du schéma de l'utilisateur pour qu'il soit accessible depuis d'autres parties du code
module.exports = UserSchema;
